import Travel from "../models/travelModel.js";
import { askGeminiForItinerary } from "../utils/gemini.js";
import { getCityCoordinates } from "../utils/opentrip.js";
import Booking from "../models/bookingModel.js";
import nodemailer from "nodemailer";

export const generateTravelPlan = async (req, res) => {
  const { destination, budget, days, startDate } = req.body;

  if (!destination || !budget || !days || !startDate) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const itinerary = await askGeminiForItinerary({
    destination,
    budget,
    days,
    startDate,
  });
  res.json({ itinerary });
};

export const getAllTravels = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      fromCity,
      toCountry,
      toCity,
      minPrice,
      maxPrice,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (fromCity) {
      filter["from.city"] = new RegExp(fromCity, "i");
    }

    if (toCountry) {
      filter["to.country"] = new RegExp(toCountry, "i");
    }

    if (toCity) {
      filter["to.city"] = new RegExp(toCity, "i");
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const travels = await Travel.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Travel.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      travels,
      currentPage: parseInt(page),
      totalPages,
      totalCount: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTravel = async (req, res) => {
  try {
    const {
      fromCity,
      toCity,
      price,
      seatsAvailable,
      description,
      startDate,
      endDate,
    } = req.body;

    if (
      !fromCity ||
      !toCity ||
      !price ||
      !seatsAvailable ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({
          error:
            "fromCity, toCity, price, seatsAvailable, startDate və endDate tələb olunur.",
        });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const parsedPrice = parseFloat(price);
    const parsedSeats = parseInt(seatsAvailable);

    if (isNaN(parsedPrice) || isNaN(parsedSeats)) {
      return res
        .status(400)
        .json({ error: "Qiymət və mövcud yerlər rəqəm olmalıdır" });
    }

    let from, to;

    try {
      from = await getCityCoordinates(fromCity);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      to = await getCityCoordinates(toCity);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const travelCode = generateTravelCode(
      fromCity,
      toCity,
      parsedStartDate.toISOString().slice(0, 10)
    );

    const newTravel = new Travel({
      from,
      to,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      price: parsedPrice,
      seatsAvailable: parsedSeats,
      travelCode,
      description,
      image: req.file ? req.file.path : "",
    });

    await newTravel.save();
    res.status(201).json(newTravel);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Tur əlavə edilə bilmədi", detail: error.message });
  }
};

export const getTravelById = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ error: "Tapılmadı" });
    res.json(travel);
  } catch (error) {
    res.status(500).json({ error: "Xəta baş verdi." });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

export const deleteTravel = async (req, res) => {
  const { id } = req.params;

  try {
    const travel = await Travel.findById(id);
    if (!travel) {
      return res.status(404).json({ message: "Səyahət tapılmadı" });
    }

    const bookings = await Booking.find({ travel: id }).populate("user");

    if (bookings.length > 0) {
      for (const booking of bookings) {
        const userEmail = booking.user.email;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: "Your reservation trip has been deleted.",
          text: `
Dear ${booking.user.name},

Unfortunately, the trip you booked with the travel code "${travel.travelCode}" has been removed from our system.

We sincerely apologize for any inconvenience this may have caused. Our team is here to assist you with alternative options or any other inquiries you may have.

Please feel free to contact us at any time — we’ll be happy to help!

Thank you for your understanding,  
Your WorldTrip Team

          `,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    await Booking.deleteMany({ travel: id });

    await travel.deleteOne();

    res
      .status(200)
      .json({
        message:
          "Travel and related reservations have been deleted, and emails have been sent to customers.",
      });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

const generateTravelCode = (fromCity, toCity, startDate) => {
  const datePart = new Date(startDate)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  return `TRAVEL-${fromCity.slice(0, 3).toUpperCase()}-${toCity
    .slice(0, 3)
    .toUpperCase()}-${datePart}`;
};
