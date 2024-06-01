const {
  get_productos,
  post_producto,
  get_producto_by_id,
  put_producto,
  delete_producto
} = require('../services/producto.service');

const all_products = async (req, res) => {
  try {
    const { success, data, message } = await get_productos();
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

const new_product = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen_url, categoria_id } = req.body;
    const { success, message } = await post_producto(nombre, precio, descripcion, imagen_url, categoria_id);
    if (success) {
      res.status(201).json({ message });
    } else {
      res.status(400).json({ message });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const product_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, data, message } = await get_producto_by_id(id);
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

const update_product = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, imagen_url, categoria_id } = req.body;
    const { success, message } = await put_producto({ id, nombre, precio, descripcion, imagen_url, categoria_id });
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

const delete_product = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, message } = await delete_producto(id);
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

module.exports = {
  all_products,
  new_product,
  product_by_id,
  update_product,
  delete_product
}




