const { Types } = require("mongoose");
const Contact = require("../service/schemas/contact");
const {
  createUserValidator,
  updateStatusValidator,
  changeUserValidator,
} = require("../utils/validator");

const checkUserAddData = async (req, res, next) => {
  const { value } = createUserValidator(req.body);

  const requiredFields = ["name", "email", "phone"];
  for (const field of requiredFields) {
    if (!value[field]) {
      return res
        .status(400)
        .json({ message: `missing required ${field} field` });
    }
  }
  const contactExists = await Contact.exists({ email: value.email });
  if (contactExists)
    return res
      .status(409)
      .json({ message: "Contact with this email already exists..." });

  req.body = value;

  next();
};

const checkUserPutData = (req, res, next) => {
  const { error, value } = changeUserValidator(req.body);

  if (error) return res.status(400).json({ message: "missing fields" });

  req.body = value;

  next();
};

const checkStatusData = (req, res, next) => {
  const { error, value } = updateStatusValidator(req.body);

  if (error) return res.status(400).json({ message: "missing field favorite" });

  req.body = value;

  next();
};

const checkContactId = (req, res, next) => {
  const { contactId } = req.params;

  const idIsValid = Types.ObjectId.isValid(contactId);
  if (!idIsValid) return res.status(404).json({ message: "Not Found" });

  next();
};

module.exports = {
  checkUserAddData,
  checkUserPutData,
  checkStatusData,
  checkContactId,
};
