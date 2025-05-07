// backend/controllers/admin.controller.js
import User from "../models/User.js";
import Post from "../models/Post.js";

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all posts (admin only)
// @route   GET /api/admin/posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("comments");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete any post (admin only)
// @route   DELETE /api/admin/posts/:id
const deleteAnyPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.remove();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Ban any user (admin only)
// @route   POST /api/admin/ban-user/:id
const banAnyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.banned = true;
    await user.save();

    res.json({ message: "User banned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllUsers, getAllPosts, deleteAnyPost, banAnyUser };
