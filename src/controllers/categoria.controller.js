const {
  get_categorias,
  post_categoria,
  get_categoria_by_id,
  put_categoria,
  delete_categoria,
  get_ranking_categorias
} = require('../services/categoria.service');

const all_categories = async (req, res) => {
  try {
    const { success, data, message } = await get_categorias();
    if (success) {
      res.send(data);
    } else {
      res.status(404).json(message);
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const new_category = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { success, message } = await post_categoria(nombre);
    if (success) {
      res.status(201).json({ message });
    } else {
      res.status(400).json({ message });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const category_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, data, message } = await get_categoria_by_id(id);
    if (success) {
      res.send(data);
    } else {
      res.status(404).json(message);
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const update_category = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const { success, message } = await put_categoria({ id, nombre });
    if (success) {
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const remove_category = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, message } = await delete_categoria(id);
    if (success) {
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const get_ranking = async (req, res) => {
  try {
    const { date } = req.params;
    const { success, data, message } = await get_ranking_categorias(date);
    if (success) {
      res.send(data);
    } else {
      res.status(404).json({ message });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  all_categories,
  new_category,
  category_by_id,
  update_category,
  remove_category,
  get_ranking
}
