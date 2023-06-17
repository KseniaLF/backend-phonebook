const bcrypt = require("bcrypt");
const User = require("../models/user");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const { nanoid } = require("nanoid");
// const sendEmail = require("./helpers/sendEmail");

const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helpers");
const { SECRET_KEY, PROJECT_URL } = process.env;

const register = async (req, res, next) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    subscription: req.body.subscription,
  };

  const currentUser = await User.findOne({ email: user.email });
  if (currentUser !== null) {
    return res.status(409).json({ message: "Email in use" });
  }

  user.password = await bcrypt.hash(user.password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({ ...user, verificationToken });

  const verifyEmail = {
    to: user.email,
    subject: "Verification Code",
    html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${verificationToken}">click</a>`,
  };
  await sendEmail(verifyEmail);

  return res
    .status(201)
    .json({ user: { email: user.email, subscription: "starter" } });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (user === null) {
    return res.status(404).json({ message: "Token is invalid" });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({ message: "Verify success" });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
    return res.status(400).json({ message: "Email already verified" });
  }

  const verifyEmail = {
    to: email,
    subject: "Verification Code",
    html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${user.verificationToken}">click</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({ message: "Verify email send" });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);

  if (!user || !user.verify) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch === false) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const { _id: id } = user;

  const payload = { id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });
  return res.json({ token, user: { email, subscription: user.subscription } });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(id, { subscription });

  res.json({ message: "Subscription updated" });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
};
