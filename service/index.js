const Contact = require("./schemas/contact");

const getAllContacts = (limit, page, favorite) => {
  const findOption = favorite !== undefined ? { favorite: favorite } : {};
  const sortOption = favorite ? { favorite: -1 } : {};

  const allContacts = Contact.find(findOption).sort(sortOption);

  const paginationPage = +page || 1;
  const paginationLimit = +limit || 5;
  const skip = (paginationPage - 1) * paginationLimit;

  allContacts.skip(skip).limit(paginationLimit);

  return allContacts;
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const createContact = ({ name, email, phone, favorite, owner }) => {
  return Contact.create({ name, email, phone, favorite, owner });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const changeStatus = (id, favorite) => {
  return Contact.findByIdAndUpdate(id, favorite, {
    new: true,
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  changeStatus,
};
