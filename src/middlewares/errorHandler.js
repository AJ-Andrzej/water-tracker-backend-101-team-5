import { isHttpError } from 'http-errors';

export function errorHandler(err, _req, res, _next) {
  if (isHttpError(err)) {
    return res
      .status(err.status)
      .send({ status: err.status, message: err.message });
  }
  res
    .status(500)
    .send({ status: 500, message: 'Something went wrong', data: err.message });
}
