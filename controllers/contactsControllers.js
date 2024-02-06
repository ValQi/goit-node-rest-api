const contactsServices = require("../services/contactServices.js");
const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/controllerWrapper.js");

const getAllContacts = async (req, res) => {
  const result = await contactsServices.listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.getContactById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.removeContact(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await contactsServices.addContact(name, email, phone);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedItems = req.body;

  const result = await contactsServices.updateById(id, updatedItems);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateFavoriteStatus = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const updatedContact = await contactsServices.updateById(id, { favorite });
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }

  res.json(updatedContact);
};

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  createContact: controllerWrapper(createContact),
  deleteContact: controllerWrapper(deleteContact),
  updateContact: controllerWrapper(updateContact),
  updateFavoriteStatus: controllerWrapper(updateFavoriteStatus),
};