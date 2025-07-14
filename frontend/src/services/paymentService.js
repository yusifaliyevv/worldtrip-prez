import axios from "./api"; // əgər baseURL təyin etmisənsə, yoxdursa sadəcə axios import et

export const createCheckoutSession = async (bookingCode, userId) => {
  const response = await axios.post("/api/payment/create-checkout-session", {
    bookingCode,
    userId,
  });
  return response.data; // burada { id: session.id } gəlir
};


export const confirmPayment = async (sessionId) => {
  const res = await axios.post(`/api/payment/confirm-payment`, {
    sessionId,
  });
  return res.data;
};
