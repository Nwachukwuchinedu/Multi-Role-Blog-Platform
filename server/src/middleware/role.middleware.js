// backend/middleware/role.middleware.js
import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const isAuthor = async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user || !["author", "admin"].includes(user.role)) {
    return res.status(403).json({ message: "Author or Admin access required" });
  }
  next();
};


export const isAuthorOrAdmin = async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user || !["author", "admin"].includes(user.role)) {
    return res.status(403).json({ message: "Author or Admin access required" });
  }
  next();
};
