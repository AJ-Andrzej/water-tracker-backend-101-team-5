import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));
export function setupServer() {
  const app = express();

  app.use(cors());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(cookieParser());

  app.use(authRouter);
  // app.use(water);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
