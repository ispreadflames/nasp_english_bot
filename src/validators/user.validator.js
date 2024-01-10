const Joi = require('joi');
const { SEXES } = require('../lib/constants');

const firstName = Joi.string().min(3).max(15).required();
const lastName = Joi.string().min(3).max(15).required();
const sex = Joi.string()
  .valid(...SEXES)
  .required();
const email = Joi.string().email();

module.exports = {
  firstName,
  lastName,
  sex,
  email
};
