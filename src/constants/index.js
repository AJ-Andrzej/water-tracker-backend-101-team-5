import path from 'node:path';
import { env } from '../utils/env.js';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL = 24 * 60 * 60 * 1000;

export const TEMP_UPLOAD_DIR = path.resolve('src', 'temp');
export const UPLOAD_DIR = path.resolve('src', 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: env('CLOUD_NAME'),
  API_KEY: env('API_KEY'),
  API_SECRET: env('API_SECRET'),
};

export const SWAGGER_PATH = path.resolve('docs', 'swagger.json');
