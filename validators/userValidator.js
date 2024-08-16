const Joi = require('joi');

// User creation schema
const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(24).required(),
  role: Joi.string().valid('admin', 'user').default('user'),
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(24).required(),
});

module.exports = {
  validateUser: (data) => userSchema.validate(data),
  validateLogin: (data) => loginSchema.validate(data),
};
