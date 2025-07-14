import api from "./api";

// Get all travels
export const getAllTravels = async (params) => {
  const res = await api.get("/api/travels", { params });
  return res.data;
};


// Create a travel
export const createTravel = async (travelData) => {
  const res = await api.post("/api/travels", travelData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return res.data;
};

// Get travel by ID
export const getTravelById = async (id) => {
  const res = await api.get(`/api/travels/${id}`);
  return res.data;
};

// Delete travel
export const deleteTravel = async (id) => {
  const res = await api.delete(`/api/travels/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

// Update travel
export const updateTravel = async (id, travelData) => {
  const res = await api.put(`/api/travels/${id}`, travelData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data;
};
