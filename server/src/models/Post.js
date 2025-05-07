// backend/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  image: {
    url: { type: String }, // URL of the uploaded image
    alt: { type: String }, // Optional alt text
  },
});

export default mongoose.model("Post", postSchema);
