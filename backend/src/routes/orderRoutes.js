import express from "express";
import { placeOrder, getUserOrders, getOrderById } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate, schemas } from "../middleware/validation.js";
import { orderLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Protected routes
router.post("/", protect, orderLimiter, validate(schemas.placeOrder), placeOrder);
router.get("/", protect, getUserOrders);
router.get("/:orderId", protect, getOrderById);

export default router;
