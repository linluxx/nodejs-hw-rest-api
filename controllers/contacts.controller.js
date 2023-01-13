const { Contacts } = require("../models/contacts");

async function getContacts(req, res) {
  const contacts = await Contacts.find();
  res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const id = req.params.contactId;
  const contact = await Contacts.findById(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found!" });
  }

  return res.status(300).json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;
  const newContact = Contacts.create(name, email, phone);
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const id = req.params.contactId;
  const contact = await Contacts.findById(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found!" });
  }
  await Contacts.findByIdAndRemove(id);
  res.status(200).json(contact);
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const body = req.body;
  const updatedContact = await Contacts.findByIdAndUpdate(contactId, body);
  if (!updatedContact) {
    return res.status(400).json({ message: "Not found" });
  }
  return res.status(200).json(updatedContact);
}

module.exports = {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContact,
};