import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { forgotMail, recieveMail } from "../middleware/mailer/mailer.js";
import jwt from "jsonwebtoken";
import RegisterValidationSchema from "../middleware/validation/RegisterValidation.js";
import LoginValidationSchema from "../middleware/validation/LoginValidation.js";
import ForgotValidationSchema from "../middleware/validation/ForgotValidation.js";
import ResetValidationSchema from "../middleware/validation/ResetValidation.js";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Şəkil yükləmək mütləqdir" });
    }

    const { filename } = req.file;

    const imageUrl = `images/${filename}`.replace(/\\/g, "/");

    const { error } = RegisterValidationSchema.validate({
      name,
      username,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      image: imageUrl,
      name,
      username,
      email,
      password: hasedPassword,
      isAdmin: false,
      isPremium: false,
      isVerified: false,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const confirmLink = `${process.env.SERVER_LINK}/auth/verify?token=${token}`;

    await recieveMail(newUser, confirmLink);

    generateToken(newUser, res);

    return res.status(201).json({
      message: "User created successfully",
      newUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token not provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updatedVerify = await User.findByIdAndUpdate(
      { _id: decoded.id },
      { isVerified: true }
    );

    if (updatedVerify) {
      return res.redirect(`${process.env.CLIENT_LINK}/`);
    }
  } catch (error) {
    return res.status(400).json({ message: "Token not valid or expaired in" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { error } = LoginValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await User.findOne({ username: username });

    if (!existUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Username or Password wrong" });
    }

    const token = generateToken(existUser, res);

    return res.status(200).json({
      message: "User logged in successfully",
      existUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "User logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = ForgotValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await User.findOne({ email });

    if (!existUser) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const resetLink = `${process.env.CLIENT_LINK}/resetpassword?token=${resetToken}`;

    await forgotMail(existUser, resetLink);

    return res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Token yoxdursa, cavab ver
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token tapılmadı, yenisini tələb edin" });
    }

    const { error } = ResetValidationSchema.validate({ password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Tokeni doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "İstifadəçi tapılmadı və ya token etibarsızdır" });
    }

    // Şifrəni yenilə
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: "Şifrə uğurla yeniləndi" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const userId = req.user.id; // Token'dən gələn user id

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Əgər şəkil yenilənirsə
    if (req.file) {
      const { filename } = req.file;
      const imageUrl = `images/${filename}`.replace(/\\/g, "/");
      user.image = imageUrl;
    }

    // Digər məlumatları dəyiş
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedUser: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
