// backend/routes/user.routes.js
import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  banUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Admin-only routes
router.route("/").get(isAdmin, getUsers);

router
  .route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(isAdmin, deleteUser);

router.post("/ban/:id", isAdmin, banUser);

export default router;
