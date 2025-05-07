// backend/routes/auth.routes.js
import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
router.post("/register", register);

// @desc    Login user and get token
// @route   POST /api/auth/login
router.post("/login", login);

export default router;
