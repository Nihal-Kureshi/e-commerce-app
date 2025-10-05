import express from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);

export default router;
