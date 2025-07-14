const verifyVerified = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({ message: "Email təsdiqlənməyib" });
  }
  next();
};

export default verifyVerified;
