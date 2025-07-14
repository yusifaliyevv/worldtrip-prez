const verifyPremium = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ message: "Premium istifadəçi tələb olunur" });
  }
  next();
};

export default verifyPremium;
