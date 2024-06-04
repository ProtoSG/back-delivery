const { Router } = require('express');
const {
  all_categories,
  new_category,
  category_by_id,
  update_category,
  remove_category,
  get_ranking
} = require('../controllers/categoria.controller');

const { authenticateJwt } = require('../middelwares/sessionValidator')

const router = Router();

router
  .get('/rank/:date', authenticateJwt, get_ranking)
  .get('/', all_categories)
  .post('/', new_category)
  .get('/:id', category_by_id)
  .put('/:id', update_category)
  .delete('/:id', remove_category)

module.exports = router;
