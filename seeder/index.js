import Categories from "../model/category";
import catagoriesData from "./category";

import Brands from "../model/brand";
import brandData from "./brand";

module.exports.seeder = async () => {
  try {
    const categories = await Categories.find();

    if (categories.length === 0) {
      await Categories.insertMany(catagoriesData);
      console.log("Categories added");
    }

    const brands = await Brands.find();

    if (brands.length === 0) {
      await Brands.insertMany(brandData);
      console.log("Brands added");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
