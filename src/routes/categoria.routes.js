const { Router } = require('express');
const {
  all_categories,
  new_category,
  category_by_id,
  update_category,
  remove_category,
  get_ranking
} = require('../controllers/categoria.controller');


const router = Router();

router
  .get('/', all_categories)
  .post('/', new_category)
  .get('/:id', category_by_id)
  .put('/:id', update_category)
  .delete('/:id', remove_category)
  .get('/ranking/:date', get_ranking);

module.exports = router;
