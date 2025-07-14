import express from "express";
import { getCityCoordinates } from "../utils/opentrip.js"; // getCityCoordinates funksiyasını import et

const router = express.Router();

// Şəhər koordinatlarını əldə edəcək API endpoint
router.get("/places/:city", async (req, res) => {
  const { city } = req.params; // URL parametri olaraq şəhər adı alırıq
  try {
    const coordinates = await getCityCoordinates(city); // getCityCoordinates funksiyası ilə koordinatları alırıq
    res.json(coordinates); // Koordinatları frontend-ə göndəririk
  } catch (error) {
    res.status(500).json({ message: "Koordinatlar alınarkən xəta baş verdi." });
  }
});

export default router;
