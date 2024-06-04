const { sign } = require('jsonwebtoken');
require('dotenv').config();

const TOKEN_SECRET = process.env.JWT_SECRET_KEY;

const createJwt = (id, username) => {
  const singUser = sign({ id, username }, TOKEN_SECRET, {expiresIn: '1h'});
  return singUser;
}

module.exports = { createJwt };
