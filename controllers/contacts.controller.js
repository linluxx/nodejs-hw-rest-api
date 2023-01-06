const db = require("../models/contacts");

async function getContacts(req, res) {
  const contacts = await db.listContacts();
  res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const id = req.params.contactId;
  const contact = await db.getContactById(id);
  if (!contact) {
    return next(res.status(404).json({ message: "Contact not found!" }));
  }

  return res.status(300).json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;
  const newContact = db.addContact(name, email, phone);
  res.status(201).json(newContact);
  console.log(newContact);
}

async function deleteContact(req, res, next) {
  const id = req.params.contactId;
  const contact = await db.getContactById(id);
  if (!contact) {
    res.status(404).json({ message: "Contact not found!" });
  }
  await db.removeContact(id);
  res.status(200).json({ "Contact was successfully deleted!": contact });
}

module.exports = { getContact, getContacts, deleteContact, createContact };
