
const Joi = require('joi');

const userPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)                                  // minimal 8 karakter
    .pattern(new RegExp('(?=.*[a-z])'))      // harus ada huruf kecil
    .pattern(new RegExp('(?=.*[A-Z])'))      // harus ada huruf besar
    .pattern(new RegExp('(?=.*[0-9])'))      // harus ada angka
    .pattern(new RegExp('(?=.*[!@#$%^&*])')) // harus ada simbol
    .required()
    .messages({
      'string.min': 'Password minimal 8 karakter',
      'string.pattern.base': 'Password harus mengandung huruf besar, kecil, angka, dan simbol',
    }),

  role: Joi.string().valid('ADMIN', 'STAFF').default('STAFF'),
});

module.exports = { userPasswordSchema };
