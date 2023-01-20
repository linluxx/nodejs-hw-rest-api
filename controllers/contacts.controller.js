const { Contacts } = require("../models/contacts");

async function getContacts(req, res) {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contacts.find().skip(skip).limit(limit);
  return res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const id = req.params.contactId;
  const contact = await Contacts.findById(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found!" });
  }

  return res.status(200).json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite } = req.body;
  const newContact = await Contacts.create({ name, email, phone, favorite });
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const id = req.params.contactId;
  const contact = await Contacts.findByIdAndRemove(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found!" });
  }
  await Contacts.findByIdAndRemove(id);
  res.status(200).json(contact);
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const body = req.body;
  console.log(body);
  const updatedContact = await Contacts.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!updatedContact) {
    return res.status(400).json({ message: "Not found" });
  }
  return res.status(200).json(updatedContact);
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const body = req.body;
  if (!body) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const updatedStatusContact = await Contacts.findByIdAndUpdate(
    contactId,
    body,
    { new: true }
  );

  if (!updatedStatusContact) {
    return res.status(400).json({ message: "Not found" });
  }
  return res.status(200).json(updatedStatusContact);
}

module.exports = {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
