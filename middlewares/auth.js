const jwt = require('jsonwebtoken');
const { ERROR_NOT_VALID_AUTH, ERROR_ACCESS_DENIED } = require('../constants/constants');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_ACCESS_DENIED).send({ message: 'Недостаточно прав' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET'); // todo ссылка на серкет должна быть
  } catch (error) {
    res.status(ERROR_NOT_VALID_AUTH).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
}

module.exports = {
  auth,
};
