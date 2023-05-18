const Joi = require("@hapi/joi");


const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phonenumber: Joi.string().min(10).optional(),
    userType: Joi.string().valid('public', 'staff').optional().default('public'), // Add the userType field
    staffKey: Joi.string().optional(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
      const schema = Joi.object({
      email: Joi.string().min(6).required().email(),
      password: Joi.string().min(6).required(),
    });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;