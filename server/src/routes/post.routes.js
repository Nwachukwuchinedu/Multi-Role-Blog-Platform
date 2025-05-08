// backend/routes/post.routes.js
import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAuthorOrAdmin } from "../middleware/role.middleware.js";
import upload from "../utils/upload.utils.js";

const router = express.Router();

// Public routes (no auth required)
router.route("/").get(getPosts);

router.route("/:id").get(getPostById);

// Protected: Only logged-in users can interact
router.route("/").post(protect, upload.single("image"), createPost);

router
  .route("/:id")
  .put(protect, isAuthorOrAdmin, upload.single("image"), updatePost)
  .delete(protect, isAuthorOrAdmin, deletePost);

// Like & Comment Routes (authenticated users only)
router.post("/like/:id", protect, likePost);
router.post("/comment/:id", protect, addComment);

export default router;
