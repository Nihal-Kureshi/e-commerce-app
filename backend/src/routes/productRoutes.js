import express from "express";
import { getProducts, seedProducts } from "../controllers/productController.js";
import { validateQuery, schemas } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", validateQuery(schemas.productQuery), getProducts);

// Optional: seed products (for testing/demo)
router.post("/seed", seedProducts);

export default router;
