import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
  verifyEmail,
} from "../controllers/userController.js";
import upload from "../upload/upload.js";
import verifyToken from "../middleware/protected/verifyToken.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("image"), register);
userRouter.get("/verify", verifyEmail);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/resetpassword", resetPassword);
userRouter.put("/update", verifyToken, upload.single("image"), updateUser);

export default userRouter;
