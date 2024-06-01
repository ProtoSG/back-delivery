const { Router } = require('express');
const {
  all_order_extras,
  new_order_extra,
  order_extra_by_id,
  ranking_extras
} = require('../controllers/pedido_extra.controller');


const router = Router();

router
  .get('/', all_order_extras)
  .post('/', new_order_extra)
  .get('/:id', order_extra_by_id)
  .get('/ranking/:date', ranking_extras);

module.exports = router;
