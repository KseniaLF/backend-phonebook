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
    // console.log(123123);
    const user = await User.findById(id);

    if (!user) {
      console.log(user);
      next(new HttpError(401, "Not authorized user"));
    }
    if (!user.token) {
      // console.log(user.token);
      next(new HttpError(401, "Not authorized token"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new HttpError(401, "Not authorized"));
  }
};
module.exports = authenticate;
