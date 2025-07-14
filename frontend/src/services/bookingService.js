// src/redux/services/bookingService.js
import api from "./api";  // öz api instance-n varsa

export const createBooking = async (data) => {
  const res = await api.post("/api/bookings", data);
  return res.data;
};

export const getUserBookings = async () => {
  const res = await api.get("/api/bookings");
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await api.get(`/api/bookings/${id}`);
  return res.data;
};

export const updateBooking = async (id, data) => {
  const res = await api.put(`/api/bookings/${id}`, data);
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/api/bookings/${id}`);
  return res.data;
};


// admin bookings
export const getAllBookings = async (params) => {
  const res = await api.get("/api/admin/bookings", { params });
  return res.data;
};
