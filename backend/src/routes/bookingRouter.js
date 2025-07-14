import express from "express";
import { createBooking, getUserBookings, updateBooking, deleteBooking, getAllBookings, getBookingById } from "../controllers/bookingController.js";
import verifyToken from "../middleware/protected/verifyToken.js";
import bookingValidation from "../middleware/validation/BookingValidation.js";
import verifyAdmin from "../middleware/protected/verifyAdmin.js";


const router = express.Router();

router.post("/", verifyToken, bookingValidation, createBooking);
router.get("/", verifyToken, getUserBookings);
router.get("/:id", verifyToken, getBookingById);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, deleteBooking);
// router.get("/admin/all", verifyToken, verifyAdmin, getAllBookings);


export default router;
