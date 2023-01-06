const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve(__dirname, "./contacts.json");

const listContacts = async () => {
  const contactsRaw = await fs.readFile(contactsPath);
  const contactsList = JSON.parse(contactsRaw);
  return contactsList;
};

const getContactById = async (contactId) => {
  const contactsList = await listContacts();
  const currentContact = contactsList.find(
    (contact) => contact.id === contactId
  );
  return currentContact;
};

const removeContact = async (contactId) => {
  const contactsList = await listContacts();
  const updateContacts = contactsList.filter(
    (contact) => contact.id !== contactId.toString()
  );
  await fs.writeFile(contactsPath, JSON.stringify(updateContacts, null, 2));
};

const addContact = async (name, email, phone) => {
  const id = nanoid();
  const contact = { id, name, email, phone };
  const contactsList = await listContacts();
  contactsList.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
