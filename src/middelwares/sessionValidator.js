const { verify } = require('jsonwebtoken');
require('dotenv').config();

const TOKEN_SECRET = process.env.JWT_SECRET_KEY;

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
  }
  const token = authHeader.split(' ').pop();
  if (token) {
    verify(token, TOKEN_SECRET, (err, admin) => {
      if (err) return res.sendStatus(403);
      req.admin = admin;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { authenticateJwt }
