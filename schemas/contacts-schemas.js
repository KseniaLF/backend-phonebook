const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
}).messages({
  "any.required": "missing fields",
});

module.exports = {
  contactAddSchema,
};
