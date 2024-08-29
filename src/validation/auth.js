import Joi from 'joi';
export const registerUserSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required(),
  password: Joi.string().min(8).max(64).required(),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(64).required(),
  confirmPassword: Joi.ref('newPassword'),
}).with('newPassword', 'confirmPassword');
