const { verify, sign } = require('jsonwebtoken');
require('dotenv').config();

const TOKEN_SECRET = process.env.JWT_SECRET_KEY;

const createJwt = (id, username) => {
  const singUser = sign({ id, username }, TOKEN_SECRET);
  return singUser;
}

const verifyJwt = (token) => {
  try {
    return verify(token, TOKEN_SECRET);
  } catch (error) {
    return error;
  }
}

module.exports = { createJwt, verifyJwt };
