const {
  post_admin,
  get_admin_by_id,
  put_admin,
  exist_admin_by_username_and_id
} = require('../services/admin.service');

const { encryptPass } = require('../helpers/bcrypt');
const { get_admin_by_username } = require('../services/admin.service');

const new_admin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await encryptPass(password);

    const { success: exists } = await get_admin_by_username(username);
    if (exists) {
      return res.status(400).json({ message: 'Admin ya existe' });
    }

    const { success, message } = await post_admin(username, hashedPassword);

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
    const admin = req.admin;
    console.log("admin", admin);
    const { data } = await get_admin_by_username(admin.username);
    console.log(data);
    const { username, checkPassword, password } = req.body;

    const match = await comparePass(checkPassword, data.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const exists = await exist_admin_by_username_and_id(data.id, username);
    if (exists) {
      return res.status(400).json({ message: 'Admin ya existe' });
    }

    const hashedPassword = await encryptPass(password);

    const { success, message } = await put_admin(data.id, username, hashedPassword);

    if (success) {
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_admin = async (req, res) => {
  const admin = req.admin;
  res.send(admin);
}

module.exports = {
  new_admin,
  admin_by_id,
  update_admin,
  get_admin
}

