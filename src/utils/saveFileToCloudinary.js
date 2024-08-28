import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';
import * as fs from 'node:fs/promises';

cloudinary.config({
  secure: true,
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export async function saveFileToCloudinary(file) {
  const { secure_url } = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return secure_url;
}
