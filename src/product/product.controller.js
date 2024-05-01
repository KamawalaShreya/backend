import Products from "../../model/products";
import { NotFoundException } from "../common/error-exceptions";
import ProductService from "./product.service";
class ProductController {
  static async index(req, res) {
    const data = await ProductService.index(req.query);

    return res.send(data);
  }
  static async add(req, res) {
    const data = await ProductService.add(req.user, req.body, req.files);

    return res.send({ message: "Product Added." });
  }

  static async edit(req, res) {
    const data = await ProductService.edit(req.body, req.query, req.files);

    return res.send({ message: "Product Edited." });
  }

  static async delete(req, res) {
    const data = await Products.findOne({ _id: req.query.productId });

    if (!data) {
      throw new NotFoundException("Product not found.");
    }

    await Products.deleteOne({ _id: req.query.productId });
    return res.send({ message: "Product deleted" });
  }

  static async categories(req, res) {
    const data = await ProductService.categories();

    return res.send({ data });
  }

  static async brands(req, res) {
    const data = await ProductService.brands();

    return res.send({ data });
  }
}

export default ProductController;
