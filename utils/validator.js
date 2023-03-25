const joi = require("joi");

const createUserValidator = (data) =>
  joi
    .object({
      name: joi.string().min(2).required(),
      email: joi.string().min(6).email().required(),
      phone: joi.string().min(5).required(),
    })
    .validate(data);

const changeUserValidator = (data) =>
  joi
    .object({
      name: joi.string().min(2).optional(),
      email: joi.string().min(6).email().optional(),
      phone: joi.string().min(5).optional(),
    })
    .or("name", "email", "phone")
    .validate(data);

const updateStatusValidator = (data) =>
  joi
    .object({
      favorite: joi.boolean().required(),
    })
    .validate(data);

module.exports = {
  createUserValidator,
  updateStatusValidator,
  changeUserValidator,
};
