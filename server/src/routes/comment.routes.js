// backend/routes/comment.routes.js
import express from "express";
import {
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Public route
router.route("/:id").get(getCommentById);

// Author/Admin routes
router.route("/:id").put(updateComment).delete(deleteComment);

export default router;
