import { userDailyNorm } from '../services/water.js';
import {
  addWater,
  updateWater,
  deleteWater,
  getWaterIntake,
  getAllWaterIntakes,
} from '../services/water.js';
import { createMonthData } from '../utils/createMonthData.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

export async function waterController(req, res, next) {
  const { dailyNorma } = req.body;
  const userId = req.user._id;

  await userDailyNorm(dailyNorma, userId);

  res.send({
    status: 200,
    message: 'Your daily norma of water is updated',
    data: dailyNorma,
  });
}

export async function waterIntakesController(req, res, next) {
  const dateOnly = new Date().toISOString().split('T')[0];

  const data = {
    time: req.body.time,
    userId: req.user._id,
    amount: req.body.amount,
    date: dateOnly,
  };

  if (data.amount > 5000) {
    return next(createHttpError(400, 'Amount of water is too high'));
  }

  await addWater(data);

  res.send({
    status: 200,
    message: 'Your data has been saved successfully',
    data,
  });
}

export async function updateWaterIntakes(req, res, next) {
  const waterId = req.params.waterId;
  const userId = req.user._id;

  const data = {
    time: req.body.time,
    amount: req.body.amount,
  };

  const updatedContact = await updateWater(waterId, data, userId);

  if (
    !updatedContact ||
    updatedContact.userId.toString() !== req.user._id.toString()
  ) {
    return next(createHttpError(404, 'Not found'));
  }

  res.status(200).send({
    status: 200,
    message: 'Time and amount are updated',
    data: updatedContact,
  });
}

export async function deleteWaterIntakes(req, res, next) {
  const waterId = req.params.waterId;
  const userId = req.user._id;

  const deletedContact = await deleteWater(waterId, userId);

  if (
    !deletedContact ||
    deletedContact.userId.toString() !== req.user._id.toString()
  ) {
    return next(createHttpError(404, 'Not found'));
  }

  if (deletedContact === null) {
    return next(createHttpError(404, 'Not found'));
  }

  res.status(204).end();
}

export async function getDailyWaterIntake(req, res, next) {
  const userId = req.user._id;

  const waterIntakes = await getWaterIntake(userId);
  console.log(waterIntakes);

  const totalAmount = waterIntakes.reduce(
    (sum, intake) => sum + intake.amount,
    0,
  );

  const user = await UsersCollection.findById(userId);
  const dailyNorma = user.dailyNorma;

  let percentage = ((totalAmount / dailyNorma) * 100).toFixed(0);

  if (percentage > 100) {
    percentage = 100;
  }

  res.status(200).json({
    status: 200,
    message: 'Daily water intake retrieved successfully',
    data: {
      percentage,
      waterIntakes: [waterIntakes],
    },
  });
}

export async function getMonthlyWaterIntake(req, res, next) {
  const userId = req.user._id;
  const year = req.body.year;
  const month = req.body.month;
  const { dailyNorma } = await UsersCollection.findById(userId);
  const data = await getAllWaterIntakes(userId);

  const monthly = createMonthData(data, year, month, dailyNorma);
  res.status(200).json({
    status: 200,
    message: 'Monthly water intake retrieved successfully',
    data: monthly,
  });
}
