const {
  get_pedido_extras,
  post_pedido_extra,
  get_pedido_extra_by_id,
  get_ranking_extras
} = require('../services/pedido_extra.service');

const all_order_extras = async (req, res) => { // GET
  try {
    const { success, data, message } = await get_pedido_extras();
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

const new_order_extra = async (req, res) => { // POST
  try {
    const { pedido_id, extra_id, cantidad } = req.body;
    const pedido_extra = { pedido_id, extra_id, cantidad }
    const { success, message } = await post_pedido_extra(pedido_extra);
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

const order_extra_by_id = async (req, res) => { // GET
  try {
    const { id } = req.params;
    const { success, data, message } = await get_pedido_extra_by_id(id);
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

const ranking_extras = async (req, res) => { // GET
  try {
    const { date } = req.params;
    const { success, data, message } = await get_ranking_extras(date);
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
  all_order_extras,
  new_order_extra,
  order_extra_by_id,
  ranking_extras
}


