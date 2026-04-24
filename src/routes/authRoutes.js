// Auth routes for user authentication (signup, login, logout)
// It help us to keep our code organized and maintainable 
// by separating the authentication logic from other parts of the application.

import express from "express";
import { signup, login,logout } from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";
const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
export default router;