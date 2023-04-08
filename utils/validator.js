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

const subsValidator = (data) =>
  joi
    .object()
    .keys({
      subscription: joi.string().valid("starter", "pro", "business"),
    })
    .validate(data);

const userValidator = (data) =>
  joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    })
    .validate(data);

const verifyValidator = (data) =>
  joi
    .object({
      email: joi.string().email().required(),
    })
    .validate(data);

module.exports = {
  createUserValidator,
  updateStatusValidator,
  changeUserValidator,
  userValidator,
  subsValidator,
  verifyValidator,
};
