const { Router } = require('express');
const {
  all_order_extras,
  new_order_extra,
  order_extra_by_id,
  ranking_extras
} = require('../controllers/pedido_extra.controller');

const { authenticateJwt } = require('../middelwares/sessionValidator')

const router = Router();

router
  .get('/rank_extra/:date', authenticateJwt, ranking_extras)
  .get('/', all_order_extras)
  .post('/', new_order_extra)
  .get('/:id', order_extra_by_id)

module.exports = router;
