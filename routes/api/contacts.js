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
const { validateBody, auth } = require("../../middlewares");
const {
  addContactSchema,
  updateContactSchema,
  updateContactFavouriteStatusSchema,
} = require("../../schemas/contacts");

const router = express.Router();

router.get("/", auth, tryCatchWrapper(getContacts));
router.get("/:contactId", tryCatchWrapper(getContact));
router.post(
  "/",
  auth,
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
