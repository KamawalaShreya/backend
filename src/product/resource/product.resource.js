import { baseUrl } from "../../common/config/constans";

class getProductResource {
  constructor(data) {
    return data.map((data) => ({
      _id: data._id,
      name: data.name,
      description: data.description,
      price: data.price,
      rating: data.rating,
      old_price: data.old_price,
      discount: data.discount,
      color: data.color,
      gender: data.gender,
      brands: data.brandData.map((b) => ({
        name: b.name,
        _id: b._id,
      })),
      categories: data.categoryData.map((b) => ({
        name: b.name,
        _id: b._id,
      })),
      images:
        data.images && data.images.length > 0
          ? data.images.map((b) => ({
              image: baseUrl() + "/" + b,
            }))
          : null,
    }));
  }
}

export default getProductResource;
