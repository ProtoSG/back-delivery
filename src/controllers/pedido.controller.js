const {
  get_pedidos,
  post_pedido,
  get_pedido_by_id,
  get_ranking_productos
} = require('../services/pedido.service');

const all_orders = async (req, res) => { // GET
  try {
    const { success, data, message } = await get_pedidos();
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

const new_order = async (req, res) => { // POST
  try {
    const { total, productos, extras } = req.body;
    const fecha_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const pedido = { total, fecha_hora }
    const { success, message } = await post_pedido(pedido, productos, extras);
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

const order_by_id = async (req, res) => { // GET
  try {
    const { id } = req.params;
    const { success, data, message } = await get_pedido_by_id(id);
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

const ranking_orders = async (req, res) => { // GET
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
  all_orders,
  new_order,
  order_by_id,
  ranking_orders
};
