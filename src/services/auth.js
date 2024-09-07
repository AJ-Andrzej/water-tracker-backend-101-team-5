import bcrypt from 'bcrypt';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_TTL, SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { UsersCollection } from '../db/models/user.js';
import { REFRESH_TOKEN_TTL } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { validateCode, getFullNameFromGoogleTokenPayload  } from '../utils/googleOAuth2.js';
import { createSession } from '../utils/createSession.js';

// registerUser
export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};
// loginUser
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};
// logoutUser
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
// createSession
// const createSession = () => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return {
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
//     refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
//   };
// };
// refreshUsersSession
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
// createProfile
export const createProfile = async (payload) => {
  const contact = await UsersCollection.create(payload);
  return contact;
};
// requestResetToken
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
// resetPassword
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
//  export const loginOrRegisterWithGoogle = async (code) => {
//   const ticket = await validateCode(code);

//   const payload = ticket.getPayload();


//   if (typeof payload === 'undefined') {
//     throw createHttpError(401, 'Unauthorized');
//   }

//   const user = await UsersCollection.findOne({ email: payload.email });

//   if (user === null) {
//     const password = await bcrypt.hash(
//       crypto.randomBytes(30).toString('base64'),
//       10,
//     );

//     const createdUser = await UsersCollection.create({
//       email: payload.email,
//       name: payload.name,
//       password,
//     });

//     return createSession.create({
//       userId: createdUser._id,
//       accessToken: crypto.randomBytes(30).toString('base64'),
//       refreshToken: crypto.generateAuthUrl(30).toString('base64'),
//       accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
//       refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
//     });
//   }

//   await createSession.deleteOne({ userId: user._id });

//   return createSession.create({
//     userId: user._id,
//     accessToken: crypto.randomBytes(30).toString('base64'),
//     refreshToken: crypto.randomBytes(30).toString('base64'),
//     accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
//     refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
//   });
// };
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

