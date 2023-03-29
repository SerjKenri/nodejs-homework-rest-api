const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

const {
  checkUserAddData,
  checkUserPutData,
  checkContactId,
  checkStatusData,
} = require("../../middlewares/contactMIddlewares");

const { auth } = require("../../middlewares/userMIddlewares");

const router = express.Router();

router.get("/", auth, listContacts);

router.get("/:contactId", auth, checkContactId, getContactById);

router.post("/", auth, checkUserAddData, addContact);

router.delete("/:contactId", auth, checkContactId, removeContact);

router.put(
  "/:contactId",
  auth,
  checkContactId,
  checkUserPutData,
  updateContact
);

router.patch(
  "/:contactId/favorite",
  checkContactId,
  checkStatusData,
  updateStatusContact
);

module.exports = router;
