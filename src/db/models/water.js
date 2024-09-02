import { Schema, model } from 'mongoose';

const waterIntakeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    amount: {
      type: Number,
      required: true,
      max: 5000,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: Date.now(),
    },
  },
  { timestamps: false, versionKey: false },
);

export const WaterIntakeCollection = model('waterIntakes', waterIntakeSchema);
