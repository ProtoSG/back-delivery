const {
  get_pedido_producto_by_id,
  post_pedido_producto,
  get_ranking_productos
} = require('../services/pedido_producto.service');

const new_order_product = async (req, res) => { // POST
  try {
    const { pedido_id, producto_id, cantidad } = req.body;
    const pedido_producto = { pedido_id, producto_id, cantidad }
    const { success, message } = await post_pedido_producto(pedido_producto);
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

const order_product_by_id = async (req, res) => { // GET
  try {
    const { id } = req.params;
    const { success, data, message } = await get_pedido_producto_by_id(id);
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

const ranking_products = async (req, res) => { // GET
  try {
    const { date } = req.params;
    const { success, data, message } = await get_ranking_productos(date);
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

module.exports = {
  new_order_product,
  order_product_by_id,
  ranking_products
}
