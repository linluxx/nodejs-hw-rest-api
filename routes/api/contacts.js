const express = require("express");
const { tryCatchWrapper } = require("../../middlewares");
const {
  getContact,
  getContacts,
  deleteContact,
  createContact,
} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares");
const { addContactSchema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));
router.get("/:contactId", tryCatchWrapper(getContact));
router.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);
router.delete("/:contactId", tryCatchWrapper(deleteContact));

// router.put("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

module.exports = router;
