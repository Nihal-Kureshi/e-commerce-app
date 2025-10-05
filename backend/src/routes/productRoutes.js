import express from "express";
import { getProducts, seedProducts } from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);

// Optional: seed products (for testing/demo)
router.post("/seed", seedProducts);

export default router;
