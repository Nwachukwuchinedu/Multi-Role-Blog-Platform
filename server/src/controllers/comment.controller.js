// backend/controllers/comment.controller.js
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

// @desc    Get comment by ID
// @route   GET /api/comments/:id
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author", "username")
      .populate("post");

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
const updateComment = async (req, res) => {
  const { text } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const user = await User.findById(req.user);
    if (
      !user ||
      (comment.author.toString() !== req.user && user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    comment.text = text || comment.text;
    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const user = await User.findById(req.user);
    if (
      !user ||
      (comment.author.toString() !== req.user && user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove comment reference from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();
    res.json({ message: "Comment removed" });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Server error" });
  }
};

export { getCommentById, updateComment, deleteComment };
