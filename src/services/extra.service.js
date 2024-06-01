const { connection } = require('../database/connection.db');
const Extra = require('../models/extra.model');

const get_extras = async () => {
  try {
    const { rows } = await connection.execute('SELECT * FROM Extra');
    const extras = [];
    rows.forEach(row => {
      const extra = new Extra(row.extra_id, row.nombre, row.precio, row.imagen_url);
      extras.push(extra);
    });
    return { success: true, data: extras }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const post_extra = async (nombre, precio, imagen_url) => {
  try {
    const query = 'INSERT INTO Extra (nombre, precio, imagen_url) VALUES (?, ?, ?)';
    await connection.execute({
      sql: query,
      args: [nombre, precio, imagen_url]
    });
    return { success: true, message: 'Extra creado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_extra_by_id = async (extra_id) => {
  try {
    const query = 'SELECT * FROM Extra WHERE extra_id = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [extra_id]
    });
    if (rows.length === 0) {
      return false, 'Extra no encontrado';
    }
    const { nombre, precio, imagen_url } = rows[0];
    const extra = new Extra(extra_id, nombre, precio, imagen_url);
    return { success: true, data: extra }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const put_extra = async ({ id, nombre, precio, imagen_url }) => {
  try {
    const query = 'UPDATE Extra SET nombre = ?, precio = ?, imagen_url = ? where extra_id = ?';
    await connection.execute({
      sql: query, args: [nombre, precio, imagen_url, id]
    });
    return { success: true, message: 'Extra actualizado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const delete_extra = async (extra_id) => {
  try {
    const query = 'DELETE FROM Extra WHERE extra_id = ?';
    await connection.execute({
      sql: query,
      args: [extra_id]
    });
    return { success: true, message: 'Extra eliminado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  get_extras,
  post_extra,
  get_extra_by_id,
  put_extra,
  delete_extra
}

