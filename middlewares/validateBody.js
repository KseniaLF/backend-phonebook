const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  return (req, res, next) => {
    console.log(schema);
    const { error } = schema.validate(req.body);
    if (error) {
      next(new HttpError(400, error.message));
    }

    next();
  };
};

module.exports = validateBody;
