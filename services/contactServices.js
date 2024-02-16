  const Contact = require('../contacts/contacts');

  async function listContacts() {
    return await Contact.find();
  }

  async function getContactById(id) {
    return await Contact.findById(id);
  }

  async function removeContact(contactId) {
    return await Contact.findByIdAndDelete(contactId);
  }

  async function addContact(name, email, phone) {
    return await Contact.create({ name, email, phone });
  }

  async function updateById(id, updatedItems) {
    return await Contact.findByIdAndUpdate(id, updatedItems, { new: true });
  }

  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateById,
  };