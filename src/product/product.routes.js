import express from "express";
import expressAsyncHandler from "express-async-handler";
const router = express.Router();
import ProductController from "./product.controller";
import storeFile from "../common/middleware/storeFile";
import authenticateUser from "../common/middleware/authenticate-user";
import validator from "../common/config/joi-validation";
import addProductDto from "./dtos/add-product.dto";

const productField = [
  { name: "images", destination: "mediaData/products", maxCounts: 10 },
];

router.get("/", authenticateUser, expressAsyncHandler(ProductController.index));

router.post(
  "/add",
  authenticateUser,
  expressAsyncHandler(storeFile(productField)),
  validator.body(addProductDto),
  expressAsyncHandler(ProductController.add)
);

router.put(
  "/edit",
  authenticateUser,
  expressAsyncHandler(storeFile(productField)),
  expressAsyncHandler(ProductController.edit)
);

router.delete(
  "/delete",
  authenticateUser,
  expressAsyncHandler(ProductController.delete)
);

router.get("/categories", expressAsyncHandler(ProductController.categories));

router.get("/brands", expressAsyncHandler(ProductController.brands));

export default router;
