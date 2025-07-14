import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Travel from "../models/travelModel.js";
import { getCityCoordinates } from "../utils/opentrip.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user travel");
  res.json(bookings);
};


export const setAdmin = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isAdmin = true;
  await user.save();

  res.json({ message: "Admin təyin olundu", user });
};

export const removeAdmin = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isAdmin = false;
  if (user.isModified("isAdmin")) {
  await user.save();
}


  res.json({ message: "Admin has been revoked.", user });
};


export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPremium = await User.countDocuments({ isPremium: true });
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalTravels = await Travel.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      users: totalUsers,
      premiumUsers: totalPremium,
      admins: totalAdmins,
      travels: totalTravels,
      bookings: totalBookings,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};



export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error: error.message });
  }
};



export const updateTravel = async (req, res) => {
  const { id } = req.params;
  const { fromCity, toCity, startDate, endDate, price, seatsAvailable } = req.body;

  try {
    const travel = await Travel.findById(id); 

    if (!travel) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const from = await getCityCoordinates(fromCity);
    const to = await getCityCoordinates(toCity);


    const datePart = new Date(startDate)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

    travel.from = from;
    travel.to = to;
    travel.startDate = startDate;
    travel.endDate = endDate;
    travel.price = price;
    travel.seatsAvailable = seatsAvailable;
    travel.travelCode = `TRAVEL-${fromCity.slice(0, 3).toUpperCase()}-${toCity
    .slice(0, 3)
    .toUpperCase()}-${datePart}`;

    await travel.save();

    res.status(200).json({ message: "Trip successfully edited", travel });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error: error.message });
  }
};



export const getAllTravelsAdmin = async (req, res) => {
  try {
    const {
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

    const travels = await Travel.find(filter);

    res.status(200).json({
      travels,
      totalCount: travels.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
