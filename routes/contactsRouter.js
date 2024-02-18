const express = require("express");
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../controllers/contactsControllers.js"); 

const validateBody = require("../helpers/validateBody.js");
const { createContactSchema, updateContactSchema } = require("../schemas/contactsSchemas.js");
const authMiddleware = require("../middleware/authMiddleware");

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware);

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.post("/", validateBody(createContactSchema), createContact);
contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);
contactsRouter.patch("/:id", validateBody(updateContactSchema), updateStatusContact);

module.exports = contactsRouter;