import Joi from 'joi';
export const registerUserSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required(),
  password: Joi.string().min(8).max(64).required(),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const updateProfileInfoSchema = Joi.object({
  dailyNorma: Joi.number(),
  userName: Joi.string().min(3).max(30),
  gender: Joi.string().valid('Man', 'Woman').optional(),
  email: Joi.string().email().min(3).max(30),
  currentPassword: Joi.string(),
  newPassword: Joi.string().min(8).max(64),
});
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
