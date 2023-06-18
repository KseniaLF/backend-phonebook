const express = require("express");

const AuthController = require("../controllers/auth");
const { authenticate, validateBody } = require("../middlewares");
const { authSchema } = require("../schemas/auth");
const { subscriptionSchema } = require("../schemas/subscription");

const router = express.Router();

const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(authSchema),
  AuthController.register
);

router.post(
  "/login",
  jsonParser,
  validateBody(authSchema),
  AuthController.login
);

router.get("/current", authenticate, AuthController.getCurrent);

router.get("/logout", authenticate, AuthController.logout);

router.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  AuthController.updateSubscription
);

module.exports = router;
