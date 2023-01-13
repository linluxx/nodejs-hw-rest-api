const express = require("express");
const { tryCatchWrapper } = require("../../middlewares");
const {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares");
const {
  addContactSchema,
  updateContactSchema,
  updateContactFavouriteStatusSchema,
} = require("../../schemas/contacts");

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));
router.get("/:contactId", tryCatchWrapper(getContact));
router.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);
router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validateBody(updateContactSchema),
  tryCatchWrapper(updateContact)
);
router.patch(
  "/:contactId/favorite",
  validateBody(updateContactFavouriteStatusSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
