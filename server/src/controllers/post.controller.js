// backend/controllers/post.controller.js
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import path from "path";
import { supabase } from "../utils/supabase.utils.js";
import mongoose from "mongoose";
// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};

    const posts = await Post.find(searchQuery)
      .populate("author", "username")
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(searchQuery);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPostsWithNoLimit = async (req, res) => {
  try {
    const searchQuery = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};

    const posts = await Post.find(searchQuery).populate("author", "username");

    const total = await Post.countDocuments(searchQuery);

    res.json({
      totalPosts: total,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// @desc    Get post by ID
// @route   GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("comments");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new post
 */

/**
 * Uploads a base64-encoded image to Supabase Storage
 */
async function uploadImageToSupabase(buffer, filename) {
  const mimeType = "image/png"; // Or detect based on file type

  const { data, error } = await supabase.storage
    .from("post-images") // Bucket name
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(filename);
  return publicUrl;
}

/**
 * Create new post
 */
const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const file = req.file;

    let imageUrl = null;

    if (file) {
      const filename = `images/${Date.now()}-${file.originalname}`;
      imageUrl = await uploadImageToSupabase(file.buffer, filename);
    }

    const newPost = await Post.create({
      title,
      content,
      author: req.user,
      tags: tags ? tags.split(",") : [],
      image: imageUrl ? { url: imageUrl } : undefined,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("🚨 Post creation error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * Update an existing post
 */
const updatePost = async (req, res) => {
  const { title, content, tags, image } = req.body;
  const file = req.file;
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.user);

    // Update basic fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags ? tags.split(",") : post.tags;

    // Handle image update

    let imageUrl = null;

    if (file) {
      const filename = `images/${Date.now()}-${file.originalname}`;
      imageUrl = await uploadImageToSupabase(file.buffer, filename);
      post.image = { url: imageUrl };
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("🚨 Post update error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findById(req.user);
    if (
      !user ||
      (post.author.toString() !== req.user && user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: "Post removed" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Like a post
// @route   POST /api/posts/like/:id
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already liked
    if (post.likes.includes(req.user)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user);
    } else {
      post.likes.push(req.user);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/comment/:id
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      text,
      author: req.user,
      post: req.params.id,
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getPosts,
  getPostsWithNoLimit,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
};
