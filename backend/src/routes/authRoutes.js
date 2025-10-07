import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate, schemas } from "../middleware/validation.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

router.post("/register", validate(schemas.register), registerUser);
router.post("/login", validate(schemas.login), loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
