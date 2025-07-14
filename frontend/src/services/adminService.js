import api from "./api";

// bütün userləri gətir
export const getAllUsers = async () => {
  const res = await api.get("/api/admin/users");
  return res.data;
};

// bütün səyahətləri gətir
export const getAllTravelsAdmin = async (params) => {
  const res = await api.get("/api/admin/travels", { params });
  return res.data;
};

// bütün bookingləri gətir
export const getAllBookings = async () => {
  const res = await api.get("/api/admin/bookings");
  return res.data;
};

// admin təyin et
export const setAdmin = async (userId) => {
  const res = await api.put(`/api/admin/user/${userId}/set-admin`);
  return res.data;
};

// admin ləğv et
export const removeAdmin = async (userId) => {
  const res = await api.put(`/api/admin/user/${userId}/remove-admin`);
  return res.data;
};

// premium təyin et
export const setPremium = async (userId, subscriptionType) => {
  const res = await api.put(`/api/admin/user/${userId}/set-premium`, { subscriptionType });
  return res.data;
};

// user sil
export const deleteUser = async (userId) => {
  const res = await api.delete(`/api/admin/user/${userId}`);
  return res.data;
};

// dashboard statistikası
export const getDashboardStats = async () => {
  const res = await api.get("/api/admin/dashboard");
  return res.data;
};

export const updateTravel = async (id, updatedData) => {
  const res = await api.put(`/api/travels/${id}`, updatedData);
  return res.data;
};

export const deleteTravel = async (id) => {
  const res = await api.delete(`/api/travels/${id}`);
  return res.data;
};
