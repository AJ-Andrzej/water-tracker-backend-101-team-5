import Joi from 'joi';

export const waterDailyNormSchema = Joi.object({
  dailyNorma: Joi.number().max(15000).required(),
});

export const addWaterSchema = Joi.object({
  time: Joi.string().required(),
  amount: Joi.number().required().max(5000),
});
