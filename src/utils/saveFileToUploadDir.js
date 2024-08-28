import path from 'node:path';
import * as fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export async function saveFileToUploadDir(file) {
  await fs.rename(
    path.resolve(TEMP_UPLOAD_DIR, file.filename),
    path.resolve(UPLOAD_DIR, file.filename),
  );

  return `http://localhost:${env('PORT')}/uploads/${file.filename}`;
}
