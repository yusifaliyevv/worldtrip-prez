import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
{
  from: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  to: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  description: { type: String },
  travelCode: { type: String, unique: true, required: true },
  image: {
  type: String,
  required: false,
  default: "",
}

},
  { timestamps: true }
);

const Travel = mongoose.model("Travel", travelSchema);
export default Travel;