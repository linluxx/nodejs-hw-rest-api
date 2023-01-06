const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  phone: Joi.string().min(3).required(),
  email: Joi.string().min(7).required(),
});

module.exports = {
  addContactSchema,
};
