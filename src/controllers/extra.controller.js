const {
  get_extras,
  post_extra,
  get_extra_by_id,
  put_extra,
  delete_extra
} = require('../services/extra.service');

const all_extras = async (req, res) => {
  try {
    const { success, data, message } = await get_extras();
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

const new_extra = async (req, res) => {
  try {
    const { nombre, precio, imagen_url } = req.body;
    const { success, message } = await post_extra(nombre, precio, imagen_url);
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

const extra_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, data, message } = await get_extra_by_id(id);
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

const update_extra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, imagen_url } = req.body;
    const { success, message } = await put_extra({ id, nombre, precio, imagen_url });
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

const remove_extra = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, message } = await delete_extra(id);
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
  all_extras,
  new_extra,
  extra_by_id,
  update_extra,
  remove_extra
}




