// backend/controllers/post.controller.js
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

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

// @desc    Create new post
// @route   POST /api/posts
const createPost = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      author: req.user,
      tags: tags ? tags.split(",") : [],
      image: req.file
        ? {
            url: `/uploads/${req.file.filename}`,
            alt: "",
          }
        : undefined,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
const updatePost = async (req, res) => {
  const { title, content, tags } = req.body;

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

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    // If image uploaded, update it
    if (req.file) {
      post.image = {
        url: `/uploads/${req.file.filename}`,
        alt: "",
      };
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Post update error:", error);
    res.status(500).json({ message: "Server error" });
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
