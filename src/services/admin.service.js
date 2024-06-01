const { connection } = require('../database/connection.db');
const Admin = require('../models/admin.model');

const post_admin = async (username, password) => {
  try {
    const query = 'INSERT INTO Admin (username, password) VALUES (?, ?)';
    await connection.execute({
      sql: query,
      args: [username, password]
    });
    return { success: true, message: 'Admin creado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_admin_by_username = async (username) => {
  try {
    const query = 'SELECT * FROM Admin WHERE username = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [username]
    });
    if (rows.length === 0) {
      return false, 'Admin no encontrado';
    }
    const { password } = rows[0];
    const admin = new Admin(username, password);
    return { success: true, data: admin }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_admin_by_id = async (admin_id) => {
  try {
    const query = 'SELECT * FROM Admin WHERE admin_id = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [admin_id]
    });
    if (rows.length === 0) {
      return false, 'Admin no encontrado';
    }
    const { username, password } = rows[0];
    const admin = new Admin(username, password);
    return { success: true, data: admin }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const put_admin = async ({ id, username, password }) => {
  try {
    const query = 'UPDATE Admin SET username = ?, password = ? where admin_id = ?';
    await connection.execute({
      sql: query, args: [username, password, id]
    });
    return { success: true, message: 'Admin actualizado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  post_admin,
  get_admin_by_username,
  get_admin_by_id,
  put_admin
}

