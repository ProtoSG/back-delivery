const { Router } = require('express');
const {
  new_admin,
  update_admin,
  get_admin
} = require('../controllers/admin.controller');

const { authenticateJwt } = require('../middelwares/sessionValidator')

const router = Router();

router
  .get('/profile', authenticateJwt, get_admin)
  .put('/', authenticateJwt, update_admin)
  .post('/', new_admin)


module.exports = router;
