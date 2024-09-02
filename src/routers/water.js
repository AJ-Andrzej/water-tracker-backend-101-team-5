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
  '/user/daily-norma',
  authenticate,
  jsonParser,
  validateBody(waterDailyNormSchema),
  ctrlWrapper(waterController),
);

router.post(
  '/user/add-water',
  authenticate,
  jsonParser,
  validateBody(addWaterSchema),
  ctrlWrapper(waterIntakesController),
);

router.patch(
  '/user/update-water/:waterId',
  authenticate,
  jsonParser,
  validateBody(addWaterSchema),
  ctrlWrapper(updateWaterIntakes),
);

router.delete(
  '/user/delete-water/:waterId',
  authenticate,
  ctrlWrapper(deleteWaterIntakes),
);

router.get('/user/daily-water', authenticate, ctrlWrapper(getDailyWaterIntake));

router.get(
  '/user/monthly-water',
  authenticate,
  jsonParser,
  ctrlWrapper(getMonthlyWaterIntake),
);

export default router;
