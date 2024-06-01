const { getAllCategorias } = require('../services/categoria_service');

const getAll = async (req, res) => {
  try {
    const categories = await getAllCategorias();
    res.send(categories);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll }
