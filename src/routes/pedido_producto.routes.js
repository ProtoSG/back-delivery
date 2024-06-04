const { Router } = require('express');
const {
  new_order_product,
  order_product_by_id,
  ranking_products
} = require('../controllers/pedido_producto.controller');

const { authenticateJwt } = require('../middelwares/sessionValidator')

const router = Router();

router
  .get('/rank_productos/:date', authenticateJwt, ranking_products)
  .post('/', new_order_product)
  .get('/:id', order_product_by_id)


module.exports = router;
