const { NODE_ENV, JWT_SECRET } = process.env;

const LENGTH_OF_ID = 24;
const PASSWORD_HASH = 10;
const SECRET = NODE_ENV === 'production' ? JWT_SECRET : 'SECRET';
const STATUS_CREATED = 201;
const STATUS_OK = 200;
// eslint-disable-next-line
const URL_REG_STR = '^(https?:)\/\/(www.)?[a-zA-Z0-9\./_~:/?#!$&()*+,;=\\]\\[-]+#?$';

module.exports = {
  LENGTH_OF_ID,
  PASSWORD_HASH,
  SECRET,
  STATUS_CREATED,
  STATUS_OK,
  URL_REG_STR,
};
