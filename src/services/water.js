import { UsersCollection } from '../db/models/user.js';
import { WaterIntakeCollection } from '../models/water.js';

export async function userDailyNorm(dailyNorma, userId) {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { dailyNorma },
    { new: true },
  );
}

export async function addWater(data) {
  return await WaterIntakeCollection.create(data);
}

export function updateWater(waterId, data, userId) {
  return WaterIntakeCollection.findOneAndUpdate(
    { _id: waterId, userId },
    data,
    {
      new: true,
    },
  );
}

export function deleteWater(waterId, userId) {
  return WaterIntakeCollection.findOneAndDelete({ _id: waterId, userId });
}

export async function getWaterIntake(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await WaterIntakeCollection.find({
    userId,
    date: { $gte: today },
  });
}
