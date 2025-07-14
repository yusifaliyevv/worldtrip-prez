import express from "express";
import "dotenv/config";
import cors from "cors";
import "./src/db/dbConnection.js";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import travelRouter from "./src/routes/travelRouter.js";
import bookingRouter from "./src/routes/bookingRouter.js";
import adminRouter from "./src/routes/adminRouter.js";
import paymentRouter from "./src/routes/paymentRouter.js";
import placesRouter from "./src/routes/places.js";

const port = process.env.PORT || 5001;
const app = express();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(cookieParser());

//routes
app.use("/auth", userRouter);
app.use("/images", express.static("public/images"));
app.use("/api/travels", travelRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);
app.use("/api", placesRouter);


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
