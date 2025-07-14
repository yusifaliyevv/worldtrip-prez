import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    travel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Travel",
      required: true,
    },
    numberOfPeople: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
