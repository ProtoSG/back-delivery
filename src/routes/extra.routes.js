const { Router } = require('express');
const {
  all_extras,
  new_extra,
  extra_by_id,
  update_extra,
  remove_extra
} = require('../controllers/extra.controller');


const router = Router();

router
  .get('/', all_extras)
  .post('/', new_extra)
  .get('/:id', extra_by_id)
  .put('/:id', update_extra)
  .delete('/:id', remove_extra)
module.exports = router;
