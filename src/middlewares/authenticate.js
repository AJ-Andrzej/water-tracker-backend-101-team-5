import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, accessToken] = authHeader.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be type of Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken });
  if (session === null) {
    return next(createHttpError(401), 'Session not foun');
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);
  if (user === null) {
    return next(createHttpError(401, 'Session not foun'));
  }

  req.user = user;

  next();
}
