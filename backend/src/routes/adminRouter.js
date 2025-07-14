// routes/adminRouter.js
import express from "express";
import verifyToken from "../middleware/protected/verifyToken.js";
import verifyAdmin from "../middleware/protected/verifyAdmin.js";
import { getAllUsers, getAllBookings, deleteUser, removeAdmin, getAllTravelsAdmin } from "../controllers/adminController.js";
import { setAdmin, getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/bookings", verifyToken, verifyAdmin, getAllBookings);
router.get("/travels", verifyToken, verifyAdmin, getAllTravelsAdmin);
router.put("/user/:userId/set-admin", verifyToken, verifyAdmin, setAdmin);
router.put("/user/:userId/remove-admin", verifyToken, verifyAdmin, removeAdmin);
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.delete("/user/:userId", verifyToken, verifyAdmin, deleteUser);

export default router;
