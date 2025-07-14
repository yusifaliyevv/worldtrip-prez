import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export const generateToken = (user, res, tokenName = "token") => {
  const token = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin || false,
      isPremium: user.isPremium || false,
      isVerified: user.isVerified || false,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 gün
  });

  return token;
};
