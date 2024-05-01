import mongoose, { Schema } from "mongoose";

// Define the schema for the collection
const dataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
    },
    rating: {
      type: mongoose.Schema.Types.Decimal128,
    },
    old_price: {
      type: mongoose.Schema.Types.Decimal128,
    },
    discount: {
      type: mongoose.Schema.Types.Decimal128,
    },
    colors: [
      {
        type: String,
      },
    ],
    gender: [
      {
        type: Number,
        comment: "men - 1, women - 2, boy -3, girl - 4",
      },
    ],
    brandIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "brands",
      },
    ],
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "categories",
      },
    ],
    occassion: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Products = mongoose.model("products", dataSchema);
export default Products;
