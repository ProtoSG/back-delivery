const {
  post_admin,
  get_admin_by_id,
  put_admin
} = require('../services/admin.service');

const new_admin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { success, message } = await post_admin(username, password);
    if (success) {
      res.status(201).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const admin_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const { success, data, message } = await get_admin_by_id(id);
    if (success) {
      res.send(data);
    } else {
      res.status(404).json(message);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update_admin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const { success, message } = await put_admin({ id, username, password });
    if (success) {
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  new_admin,
  admin_by_id,
  update_admin
}

