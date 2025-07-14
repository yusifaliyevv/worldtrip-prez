import api from "./api"; // axios ilə API çağırışları

export const generateTravelPlan = async (data) => {
  const response = await api.post("/api/travels/plan", data);
  return response.data;
};
