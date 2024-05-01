import express from "express";
const router = express.Router();
import productRoutes from "../src/product/product.routes";
import authRoutes from "../src/auth/auth.routes";

router.use("/product", productRoutes);
router.use("/auth", authRoutes);

export default router;
