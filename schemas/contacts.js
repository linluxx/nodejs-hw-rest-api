const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  phone: Joi.string().min(3).required(),
  email: Joi.string().min(7).required(),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  phone: Joi.string().min(3).required(),
  email: Joi.string().min(7).required(),
  favorite: Joi.boolean().required(),
});
const updateContactFavouriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateContactFavouriteStatusSchema,
};
