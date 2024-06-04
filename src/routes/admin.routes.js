const { Router } = require('express');
const {
  new_admin,
  admin_by_id,
  update_admin,
  get_admin
} = require('../controllers/admin.controller');

const { authenticateJwt } = require('../middelwares/sessionValidator')

const router = Router();

router
  .get('/profile', authenticateJwt, get_admin)
  .post('/', new_admin)
  .get('/:id', admin_by_id)
  .put('/:id', update_admin)


module.exports = router;
