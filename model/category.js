import mongoose from "mongoose";

// Define the schema for the collection
const dataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Categories = mongoose.model("categories", dataSchema);
export default Categories;
