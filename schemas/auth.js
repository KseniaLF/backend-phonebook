const Joi = require("joi");

const authSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required(),
}).messages({
  "any.required": "missing fields",
});

module.exports = {
  authSchema,
};
