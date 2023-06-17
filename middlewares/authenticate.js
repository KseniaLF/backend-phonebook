const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HttpError } = require("../helpers");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(new HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      console.log(123);
      next(new HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new HttpError(401, "Not authorized"));
  }
};
module.exports = authenticate;