const { get_admin_by_username } = require('../services/admin.service');
const { comparePass } = require('../helpers/bcrypt');
const { createJwt } = require('../helpers/handleJwt');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { success, data, message } = await get_admin_by_username(username);
    if (success) {
      const match = await comparePass(password, data.password);
      if (match) {
        const token = createJwt(data.id, data.username);
        res.send({ token });
      } else {
        res.status(400).json({ message: 'Invalid password' });
      }
    } else {
      res.status(404).json({ message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { login }
