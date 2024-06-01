const { Router } = require('express');
const {
  new_order_product,
  order_product_by_id,
  ranking_products
} = require('../controllers/pedido_producto.controller');


const router = Router();

router
  .post('/', new_order_product)
  .get('/:id', order_product_by_id)
  .get('/ranking/:date', ranking_products);

module.exports = router;
