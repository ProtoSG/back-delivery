const { Router } = require('express');
const {
  all_orders,
  new_order,
  order_by_id,
  ranking_orders
} = require('../controllers/pedido.controller');


const router = Router();

router
  .get('/', all_orders)
  .post('/', new_order)
  .get('/:id', order_by_id)
  .get('/ranking/:date', ranking_orders);

module.exports = router;
