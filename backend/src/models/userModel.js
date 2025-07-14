import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    subscriptionType: {
      type: String,
      enum: ["none", "monthly", "yearly", "weekly"],
      default: "none",
    },
  },
  { collection: "Users", timestamps: true }
);

const user = mongoose.model("User", userSchema);
export default user;
