const { Router } = require('express');
const {
  all_products,
  new_product,
  product_by_id,
  update_product,
  delete_product
} = require('../controllers/producto.controller');


const router = Router();

router
  .get('/', all_products)
  .post('/', new_product)
  .get('/:id', product_by_id)
  .put('/:id', update_product)
  .delete('/:id', delete_product);

module.exports = router;
