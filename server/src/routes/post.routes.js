// backend/routes/post.routes.js
import express from "express";
import {
  getPosts,
  getPostsWithNoLimit,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {  isAuthorOrAdmin } from "../middleware/role.middleware.js";
import upload from '../utils/upload.utils.js'

const router = express.Router();

// All routes are protected
router.use(protect);

// Public routes
router.route("/").get(getPosts);

router.route("/nolimit").get(getPostsWithNoLimit);

router.route("/:id").get(getPostById);

// Author/Admin routes
router.route("/").post(upload.single("image"), createPost);

router
  .route("/:id")
  .put(isAuthorOrAdmin, upload.single("image"), updatePost)
  .delete(isAuthorOrAdmin, deletePost);

// Interaction routes
router.post("/like/:id", likePost);
router.post("/comment/:id", addComment);

export default router;
