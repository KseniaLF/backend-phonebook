const Contact = require("../models/contact");

const getContacts = async (owner, { skip, limit, favorite }) => {
  const data = favorite ? { owner, favorite } : { owner };

  return Contact.find(data).skip(skip).limit(limit).populate("owner");
};

const getContactById = async (id) => {
  return Contact.findOne({ _id: id });
};

const addContact = async (data) => {
  return Contact.create(data);
};

const removeContact = async (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const updateContact = async (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const updateStatusContact = async (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
