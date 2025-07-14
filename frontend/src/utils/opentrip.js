import axios from "axios";

export const getCityCoordinates = async (city) => {
  try {
    const response = await axios.get(`/api/places/${city}`)
    return response.data;
  } catch (error) {
    console.error("An error occurred while retrieving coordinates.", error);
    throw error;
  }
};
