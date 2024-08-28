import express from 'express';

import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3000'));
export function setupServer() {
  const app = express();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
