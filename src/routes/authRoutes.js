// Auth routes for user authentication (signup, login, logout)
// It help us to keep our code organized and maintainable 
// by separating the authentication logic from other parts of the application.

import express from "express";
import { signup, login,logout } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
export default router;