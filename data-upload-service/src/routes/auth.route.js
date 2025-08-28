import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUser } from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/logout", verifyUser, logoutUser);
router.get("/get-user", verifyUser, getUser);

export default router;

