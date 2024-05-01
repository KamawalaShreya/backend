import mongoose from "mongoose";

// Define the schema for the collection
const dataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Brands = mongoose.model("brands", dataSchema);
export default Brands;
