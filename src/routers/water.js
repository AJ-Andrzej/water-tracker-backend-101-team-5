import express from 'express';
import {
  waterController,
  waterIntakesController,
  updateWaterIntakes,
  deleteWaterIntakes,
  getDailyWaterIntake,
  getMonthlyWaterIntake,
} from '../controllers/water.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addWaterSchema, waterDailyNormSchema } from '../validation/water.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/users/daily-norma',
  authenticate,
  jsonParser,
  validateBody(waterDailyNormSchema),
  ctrlWrapper(waterController),
);

router.post(
  '/water/add',
  authenticate,
  jsonParser,
  validateBody(addWaterSchema),
  ctrlWrapper(waterIntakesController),
);

router.patch(
  '/water/update/:waterId',
  authenticate,
  jsonParser,
  validateBody(addWaterSchema),
  ctrlWrapper(updateWaterIntakes),
);

router.delete(
  '/water/delete/:waterId',
  authenticate,
  ctrlWrapper(deleteWaterIntakes),
);

router.get('/water/day', authenticate, ctrlWrapper(getDailyWaterIntake));

router.post(
  '/water/month',
  authenticate,
  jsonParser,
  ctrlWrapper(getMonthlyWaterIntake),
);

export default router;
