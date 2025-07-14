import Booking from "../models/bookingModel.js";
import Travel from "../models/travelModel.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import { randomBytes } from "crypto";
import path from "path";
import moment from "moment-timezone";


export const createBooking = async (req, res) => {
  try {
    const { travelCode, numberOfPeople } = req.body;

        if (!travelCode) {
      return res.status(400).json({ message: "travelCode required" });
    }

    const travel = await Travel.findOne({travelCode});
    if (!travel) return res.status(404).json({ message: "Trip not found" });

    if (travel.seatsAvailable < numberOfPeople) {
      return res.status(400).json({ message: "There is not enough space." });
    }

    const totalPrice = travel.price * numberOfPeople;

    const bookingCode = randomBytes(4).toString("hex").toUpperCase();

    const booking = new Booking({
      user: req.user.id,
      travel: travel._id,
      numberOfPeople,
      totalPrice,
      bookingCode,
      paymentStatus: "pending",
    });

    travel.seatsAvailable -= numberOfPeople;
    await travel.save();
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Reservation not possible", error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("travel");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "An error occurred." });
  }
};




export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { numberOfPeople } = req.body;

  try {
    const booking = await Booking.findById(id).populate("travel");

    if (!booking) return res.status(404).json({ message: "Reservation not found" });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to view this reservation." });
    }

    const diff = numberOfPeople - booking.numberOfPeople;

    if (diff > 0) {
      if (booking.travel.seatsAvailable < diff) {
        return res.status(400).json({ message: "There is not enough space." });
      }
      booking.travel.seatsAvailable -= diff;
    } else if (diff < 0) {
      booking.travel.seatsAvailable += (-diff);
    }

    await booking.travel.save();

    booking.numberOfPeople = numberOfPeople;
    booking.totalPrice = numberOfPeople * booking.travel.price;
    booking.isPaid = false;
    await booking.save();

    res.json({ message: "Reservation updated", booking });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("travel");

    if (!booking) return res.status(404).json({ message: "not found" });

    booking.travel.seatsAvailable += booking.numberOfPeople;
    await booking.travel.save();

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "reservation deleted" });

  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};




export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username email")
      .populate("travel");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};



export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("travel")
      .populate("user", "name username email");

    if (!booking) {
      return res.status(404).json({ message: "reservation not found" });
    }

    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to view this reservation." });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};
