const service = require("../service/index");
require("colors");

const listContacts = async (req, res, next) => {
  const { limit, page, favorite } = req.query;
  const data = await service.getAllContacts(limit, page, favorite);

  res.status(200).json(data);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contacts = await service.getContactById(contactId);
  if (contacts) {
    res.status(200).json(contacts);
  } else {
    res.status(404).json({ message: `Not found` });
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await service.removeContact(contactId);
    res.status(200).json({ message: `Contact deleted` });
  } catch (error) {
    console.log(`Oops, something wrong: ${error.message}`.red);
  }
};

const addContact = async (req, res) => {
  try {
    console.log(req.user);
    const { name, email, phone, favorite } = req.body;
    const contact = await service.createContact({
      owner: req.user,
      name,
      email,
      phone,
      favorite,
    });

    contact.owner.password = undefined;
    contact.owner.token = undefined;

    res.status(201).json(contact);
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await service.updateContact(contactId, req.body);

    res.status(200).json(contact);
  } catch (error) {
    console.log(`Oops, something wrong: ${error.message}`.red);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;

  const data = await service.changeStatus(contactId, req.body);

  return res.status(200).json(data);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
