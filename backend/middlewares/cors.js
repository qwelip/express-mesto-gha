const allowedCors = [
  'http://andmed-practicum.nomoreparties.sbs',
  'https://andmed-practicum.nomoreparties.sbs',
];

// eslint-disable-next-line consistent-return
function checkCors(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS' && allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Origin', origin);
    return res.end();
  }

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
}

module.exports = {
  checkCors,
};
