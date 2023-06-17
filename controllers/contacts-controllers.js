const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const db = require("../service/DBOperations");

const getContacts = async (req, res, next) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const list = await db.getContacts(owner, { skip, limit, favorite });

  res.status(200).json(list);
};

const getContactById = async (req, res, next) => {
  const contact = await db.getContactById(req.params.id);
  if (!contact) {
    throw new HttpError(404, "Not found");
  }

  res.status(200).json(contact);
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;

  const data = req.body;
  const newContact = await db.addContact({ ...data, owner });

  res.status(201).json(newContact);
};

const removeContact = async (req, res, next) => {
  const deletedContact = await db.removeContact(req.params.id);

  if (!deletedContact) {
    throw new HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const updatedContact = await db.updateContact(req.params.id, req.body);

  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res, next) => {
  const updatedContact = await db.updateStatusContact(req.params.id, req.body);

  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
