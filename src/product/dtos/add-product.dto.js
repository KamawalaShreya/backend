import Joi from "joi";

export default Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    gender: Joi.required(),
    price: Joi.required(),
    rating: Joi.required(),
    old_price: Joi.required(),
    discount: Joi.required(),
    colors: Joi.required(),
    brandIds: Joi.required(),
    categoryIds: Joi.required(),
    occasion: Joi.required(),
    images: Joi.optional(),
});
