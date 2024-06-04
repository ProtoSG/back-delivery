const { Router } = require('express');
const {
  all_orders,
  new_order,
  order_by_id,
  ranking_orders_days,
  ranking_orders_weeks,
  ranking_orders_months,
  ranking_orders_years
} = require('../controllers/pedido.controller');

const { authenticateJwt } = require('../middelwares/sessionValidator')

const router = Router();

router
  .get('/datos_dias', authenticateJwt, ranking_orders_days)
  .get('/datos_semanas', authenticateJwt, ranking_orders_weeks)
  .get('/datos_meses', authenticateJwt, ranking_orders_months)
  .get('/datos_anos', authenticateJwt, ranking_orders_years)
  .get('/', all_orders)
  .post('/', new_order)
  .get('/:id', order_by_id)

module.exports = router;
