const express = require("express");
const router = express.Router();

const { contactsController } = require("../../controllers");
const { validateBody } = require("../../middlewares");
const authenticate = require("../../middlewares/authenticate");
const { contactAddSchema } = require("../../schemas/contacts-schemas");
const { favoriteSchema } = require("../../schemas/favorite");

router.use(authenticate);

router.get("/", contactsController.getContacts);

router.get("/:id", contactsController.getContactById);

router.post("/", validateBody(contactAddSchema), contactsController.addContact);

router.delete("/:id", contactsController.removeContact);

router.put(
  "/:id",
  validateBody(contactAddSchema),
  contactsController.updateContact
);

router.patch(
  "/:id/favorite",
  validateBody(favoriteSchema),
  contactsController.updateStatusContact
);

module.exports = router;
