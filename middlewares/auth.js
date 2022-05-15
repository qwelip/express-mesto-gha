const jwt = require('jsonwebtoken');
const { NotValidAuthError } = require('../errors/NotValidAuthError');
const { SECRET } = require('../constants/constants');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotValidAuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (error) {
    next(new NotValidAuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
}

module.exports = {
  auth,
};
