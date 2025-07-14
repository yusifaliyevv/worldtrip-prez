import express from "express";
import { createCheckoutSession, confirmPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm-payment", confirmPayment);

export default router;
