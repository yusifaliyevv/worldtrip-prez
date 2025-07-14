import axios from "axios";

const API_KEY = process.env.OPENTRIPMAP_KEY;

export const getCityCoordinates = async (city) => {
  try {
    const res = await axios.get("https://api.opentripmap.com/0.1/en/places/geoname", {
      params: { name: city, apikey: API_KEY }
    });

    const data = res.data;

    // defensive fallback country
    const country = data.country || "Unknown";

    if (
      !data ||
      typeof data.lat !== "number" ||
      typeof data.lon !== "number" ||
      !data.name ||
      data.name.toLowerCase() !== city.toLowerCase()
    ) {
      throw new Error(`'${city}' The city named was not found or does not match.`);
    }

    return {
      city: data.name,
      country: country,
      lat: data.lat,
      lon: data.lon
    };
  } catch (error) {
    console.error(`The city was not found.: ${city}`, error.message);
    throw new Error(`'${city}' The city named was not found.`);
  }
};



