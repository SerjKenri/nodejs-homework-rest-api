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
} = require("../../middlewares/userMIddlewares");

const router = express.Router();

router.get("/", listContacts);

router.get("/:contactId", checkContactId, getContactById);

router.post("/", checkUserAddData, addContact);

router.delete("/:contactId", checkContactId, removeContact);

router.put("/:contactId", checkContactId, checkUserPutData, updateContact);

router.patch(
  "/:contactId/favorite",
  checkContactId,
  checkStatusData,
  updateStatusContact
);

module.exports = router;
