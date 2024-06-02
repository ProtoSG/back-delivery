const { compare, hash } = require('bcryptjs');

const encryptPass = async (password) => {
  const salt = 10;
  return await hash(password, salt);
}

const comparePass = async (password, hash) => {
  return await compare(password, hash);
}

module.exports = {
  encryptPass,
  comparePass
}
