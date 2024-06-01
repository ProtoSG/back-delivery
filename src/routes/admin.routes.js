const { Router } = require('express');
const {
  new_admin,
  admin_by_id,
  update_admin
} = require('../controllers/admin.controller');


const router = Router();

router
  .post('/', new_admin)
  .get('/:id', admin_by_id)
  .put('/:id', update_admin);

module.exports = router;
