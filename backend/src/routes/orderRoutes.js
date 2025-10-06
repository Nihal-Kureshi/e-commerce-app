import express from "express";
import { placeOrder, getUserOrders, getOrderById } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/:orderId", protect, getOrderById);

export default router;
