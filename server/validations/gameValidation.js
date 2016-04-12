const Joi = require('joi');

function validateGuess(query) {
  return Joi.validate(query,
    Joi.object({
      character: Joi.string().length(1).required(),
      id: Joi.number().required(),
    }).required());
}

function validateDelete(query) {
  return Joi.validate(query,
    Joi.object({
      id: Joi.number().required(),
    }).required());
}

module.exports = {
  validateDelete,
  validateGuess,
};
