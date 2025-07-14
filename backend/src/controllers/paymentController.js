import Stripe from "stripe";
import Booking from "../models/bookingModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { bookingCode } = req.body;

  try {
    const booking = await Booking.findOne({ bookingCode }).populate("travel");
    if (!booking) {
      return res.status(404).json({ message: "Booking tapılmadı" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${booking.travel.from.city} ➡ ${booking.travel.to.city}`,
              description: `${booking.travel.name} (${booking.numberOfPeople} nəfər)`
            },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_LINK}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_LINK}/cancel`,
      metadata: {
        bookingCode: booking.bookingCode,
        userId: booking.user.toString(),
      },
    });

    res.json({ url: session.url }); // redirect üçün
  } catch (err) {
    console.error("Stripe xətası:", err.message);
    res.status(500).json({ message: "Ödəniş baş tutmadı", error: err.message });
  }
};








export const confirmPayment = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const bookingCode = session.metadata.bookingCode;

      const booking = await Booking.findOneAndUpdate(
        { bookingCode },
        { isPaid: true },
        { new: true }
      );

      return res.json({
        message: "Ödəniş təsdiqləndi",
        booking,
      });
    } else {
      return res.status(400).json({
        message: "Ödəniş tamamlanmayıb",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ödəniş təsdiqlənərkən xəta baş verdi",
    });
  }
};
