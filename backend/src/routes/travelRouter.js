import express from "express";
import { getAllTravels, createTravel, getTravelById, deleteTravel, generateTravelPlan } from "../controllers/travelController.js";
import verifyToken from "../middleware/protected/verifyToken.js";
import travelValidation from "../middleware/validation/TravelValidation.js";
import verifyAdmin from "../middleware/protected/verifyAdmin.js";
import { updateTravel } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", getAllTravels);
router.get("/:id", getTravelById);
router.delete("/:id", verifyToken, verifyAdmin, deleteTravel);
router.post("/", verifyToken, verifyAdmin, travelValidation, createTravel);
router.post('/plan', generateTravelPlan);
router.put("/:id", verifyToken, verifyAdmin, updateTravel);

export default router;
