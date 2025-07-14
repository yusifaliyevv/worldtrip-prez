const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin giriş tələb olunur" });
  }
};

export default verifyAdmin;
