// backend/routes/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import adminRoutes from "./admin.routes.js";
import commentRoutes from "./comment.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/admin", adminRoutes);
router.use("/comments", commentRoutes);

export default router;
