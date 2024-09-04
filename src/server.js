import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import waterRouter from './routers/water.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const whitelist = [
  'https://water-tracker-101-team-5.vercel.app',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const openCorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

const PORT = Number(env('PORT', '3000'));
export function setupServer() {
  const app = express();

  app.use('/api-docs', cors(openCorsOptions), swaggerDocs());
  app.use(cors(corsOptions));
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(cookieParser());
  // app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');
  //   next();
  // });

  app.use(authRouter);
  app.use(waterRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
