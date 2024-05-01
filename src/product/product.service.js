import Brands from "../../model/brand";
import Categories from "../../model/category";
import Products from "../../model/products";
import mongoose from "mongoose";
import { PreconditionFailedException } from "../common/error-exceptions";
import getProductResource from "./resource/product.resource";
const ObjectId = mongoose.Types.ObjectId;
class ProductService {
  static async index(reqData) {
    const currentPage = reqData.page || 1;
    const perPage = reqData.perPage || 10;
    const skip = Number((currentPage - 1) * perPage);
    const limit = Number(perPage);

    const pipeline = [];
    if (reqData.userId) {
      pipeline.push({
        $match: {
          userId: new ObjectId(reqData.userId),
        },
      });
    }

    if (reqData.brandIds) {
      const brandsId = reqData.brandIds.includes(",")
        ? reqData.brandIds.split(",")
        : [reqData.brandIds];
      const objectIds = brandsId.map((id) => new ObjectId(id));

      pipeline.push({
        $match: { brandIds: { $in: objectIds } },
      });
    }

    if (reqData.categoryIds) {
      const categoryId = reqData.categoryIds.includes(",")
        ? reqData.categoryIds.split(",")
        : [reqData.categoryIds];
      const objectIds = categoryId.map((id) => new ObjectId(id));

      pipeline.push({
        $match: { categoryIds: { $in: objectIds } },
      });
    }

    if (reqData.priceRange) {
      const [minPrice, maxPrice] = reqData.priceRange
        .split("-")
        .map(parseFloat);

      pipeline.push({
        $match: {
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        },
      });
    }

    if (reqData.discount) {
      // Assuming reqData.discount is the exact discount value to match
      const discountValue = mongoose.Types.Decimal128.fromString(
        reqData.discount
      );

      pipeline.push({
        $match: {
          discount: discountValue,
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "brands",
          localField: "brandIds",
          foreignField: "_id",
          as: "brandData",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIds",
          foreignField: "_id",
          as: "categoryData",
        },
      }
    );

    if (+reqData.sortBy == 1) {
      pipeline.push({
        $sort: {
          createdAt: 1,
        },
      });
    } else if (+reqData.sortBy == 2) {
      pipeline.push({
        $sort: {
          price: 1,
        },
      });
    } else if (+reqData.sortBy == 3) {
      pipeline.push({
        $sort: {
          rating: 1,
        },
      });
    }

    const total = await Products.aggregate(pipeline);

    pipeline.push(
      {
        $skip: skip,
      },
      {
        $limit: limit,
      }
    );

    const products = await Products.aggregate(pipeline);

    for (const prod of products) {
      prod.price = parseFloat(prod.price.toString());
      prod.rating = parseFloat(prod.rating.toString());
      prod.old_price = parseFloat(prod.old_price.toString());
      prod.discount = parseFloat(prod.discount.toString());
    }
    return {
      data: new getProductResource(products),
      meta: {
        total: total.length,
        get lastPage() {
          return this.total ? Math.ceil(Number(this.total / this.perPage)) : 0;
        },
        perPage: +perPage,
        currentPage: +currentPage,
      },
    };
  }
  static async add(authUser, reqData, files) {
    reqData.userId = authUser._id;
    reqData.name = reqData.name.trim("");
    const findProduct = await Products.findOne({ name: reqData.name });
    if (findProduct) {
      throw new PreconditionFailedException("Product alredy exist.");
    }

    if (files.images && files.images.length > 0) {
      reqData.images = [];

      for (const img of files.images) {
        reqData.images.push(img.destination + "/" + img.filename);
      }
    }

    reqData.gender = reqData.gender.includes(",")
      ? reqData.gender.split(",")
      : reqData.gender;

    const brand = reqData.brandIds.includes(",")
      ? reqData.brandIds.split(",")
      : [reqData.brandIds];
    const cat = reqData.categoryIds.includes(",")
      ? reqData.categoryIds.split(",")
      : [reqData.categoryIds];

    reqData.categoryIds = cat.map((id) => {
      if (ObjectId.isValid(id)) {
        return new ObjectId(id);
      } else {
        // Handle invalid ObjectId string
        console.error(`Invalid ObjectId string: ${id}`);
        return null; // Or handle error as needed
      }
    });
    reqData.brandIds = brand.map((id) => {
      if (ObjectId.isValid(id)) {
        return new ObjectId(id);
      } else {
        // Handle invalid ObjectId string
        console.error(`Invalid ObjectId string: ${id}`);
        return null; // Or handle error as needed
      }
    });

    reqData.colors = reqData.colors.includes(",")
      ? reqData.colors.split(",")
      : reqData.colors;

    await Products.create(reqData);
  }

  static async edit(reqData, id, files) {
    const findProduct = await Products.findOne({ _id: id.productId });

    if (!findProduct) {
      throw new PreconditionFailedException("Product not found.");
    }

    if (
      files &&
      files.images &&
      files.images != undefined &&
      files.images.length > 0
    ) {
      let imges = [];

      for (const img of files.images) {
        imges.push(img.destination + "/" + img.filename);
      }

      reqData.images = findProduct.images.concat(imges);
    }

    if (reqData.gender) {
      reqData.gender =
        reqData.gender && reqData.gender.includes(",")
          ? reqData.gender.split(",")
          : reqData.gender;
    }

    if (reqData.brandIds) {
      const brand =
        reqData.brandIds && reqData.brandIds.includes(",")
          ? reqData.brandIds.split(",")
          : [reqData.brandIds];
      if (brand.length > 0) {
        reqData.brandIds = brand.map((id) => {
          if (ObjectId.isValid(id)) {
            return new ObjectId(id);
          } else {
            // Handle invalid ObjectId string
            console.error(`Invalid ObjectId string: ${id}`);
            return null; // Or handle error as needed
          }
        });
      }
    }

    if (reqData.categoryIds) {
      const cat =
        reqData.categoryIds && reqData.categoryIds.includes(",")
          ? reqData.categoryIds.split(",")
          : [reqData.categoryIds];
      if (cat.length > 0) {
        reqData.categoryIds = cat.map((id) => {
          if (ObjectId.isValid(id)) {
            return new ObjectId(id);
          } else {
            // Handle invalid ObjectId string
            console.error(`Invalid ObjectId string: ${id}`);
            return null; // Or handle error as needed
          }
        });
      }
    }

    if (reqData.colors) {
      reqData.colors =
        reqData.colors && reqData.colors.includes(",")
          ? reqData.colors.split(",")
          : reqData.colors;
    }

    await Products.updateOne({ _id: id.productId }, reqData);
  }

  static async categories() {
    const data = await Categories.find();

    return data;
  }

  static async brands() {
    const data = await Brands.find();

    return data;
  }
}

export default ProductService;
