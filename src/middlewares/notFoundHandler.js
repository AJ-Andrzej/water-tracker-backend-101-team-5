export function notFoundHandler(_, res) {
  res.status(404).send({
    status: 404,
    message: 'Rout not Found',
  });
}
