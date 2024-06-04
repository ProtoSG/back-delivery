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
    const { admin_id, password } = rows[0];
    const admin = new Admin(admin_id, username, password);
    return { success: true, data: admin }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const exist_admin_by_username_and_id = async (id, username) => {
  try {
    const query = 'SELECT * FROM Admin WHERE username = ? AND admin_id != ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [username, id]
    });
    if (rows.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_admin_by_id = async (id) => {
  try {
    const query = 'SELECT * FROM Admin WHERE admin_id = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [id]
    });
    if (rows.length === 0) {
      return false, 'Admin no encontrado';
    }
    const { admin_id, username, password } = rows[0];
    const admin = new Admin(admin_id, username, password);
    return { success: true, data: admin }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const put_admin = async (id, username, password) => {
  try {
    console.log(id, username, password)
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
  put_admin,
  exist_admin_by_username_and_id
}

