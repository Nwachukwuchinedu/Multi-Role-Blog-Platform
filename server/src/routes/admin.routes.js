// backend/routes/admin.routes.js
import express from "express";
import {
  getAllUsers,
  getAllPosts,
  deleteAnyPost,
  banAnyUser,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(isAdmin);

// User management
router.get("/users", getAllUsers);

// Post management
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deleteAnyPost);

// User banning
router.post("/ban-user/:id", banAnyUser);

export default router;
