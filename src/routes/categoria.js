const { Router } = require('express');
const { getAll } = require('../controllers/categoria_controller');


const router = Router();

router.get('/', getAll);

module.exports = router;
