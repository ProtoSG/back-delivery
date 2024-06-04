const { connection } = require('../database/connection.db');
const Categoria = require('../models/categoria.model');

const get_categorias = async () => {
  try {
    const { rows } = await connection.execute('SELECT * FROM Categoria');
    const categorias = [];
    rows.forEach(row => {
      const categoria = new Categoria(row.categoria_id, row.nombre);
      categorias.push(categoria);
    });
    return { success: true, data: categorias }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const post_categoria = async (nombre) => {
  try {
    const query = 'INSERT INTO Categoria (nombre) VALUES (?)';
    await connection.execute({
      sql: query,
      args: [nombre]
    });
    return { success: true, message: 'Categoria creada con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_categoria_by_id = async (categoria_id) => {
  try {
    const query = 'SELECT * FROM Categoria WHERE categoria_id = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [categoria_id]
    });
    if (rows.length === 0) {
      return false, 'Categoria no encontrada';
    }
    const { nombre } = rows[0];
    const categoria = new Categoria(categoria_id, nombre);
    return { success: true, data: categoria }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const put_categoria = async ({ id, nombre }) => {
  try {
    const query = 'UPDATE Categoria SET nombre = ? where categoria_id = ?';
    await connection.execute({
      sql: query, args: [nombre, id]
    });
    return { success: true, message: 'Categoria actualizada con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const delete_categoria = async (categoria_id) => {
  try {
    const query = 'DELETE FROM Categoria WHERE categoria_id = ?';
    await connection.execute({
      sql: query,
      args: [categoria_id]
    });
    return { success: true, message: 'Categoria eliminada con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_ranking_categorias = async (date) => {
  try {
    const date_intervals = {
      'semana': "date('now', '-7 day', 'localtime', '-5 hours')",
      'mes': "date('now', '-1 month', 'localtime', '-5 hours')",
      'año': "date('now', '-1 year', 'localtime', '-5 hours')"
    };

    const date_interval = date_intervals[date];

    const baseQuery = `
      SELECT c.categoria_id, c.nombre, SUM(pp.sub_total) AS total
      FROM Producto p
      JOIN Categoria c ON p.categoria_id = c.categoria_id
      JOIN Pedido_Producto pp ON p.producto_id = pp.producto_id
      JOIN Pedido pe ON pp.pedido_id = pe.pedido_id
    `;

    let query = "";
    let queryParams = [];

    if (date === 'dia') {
      query = `${baseQuery}
        WHERE DATE(pe.fecha_hora) = DATE('now', 'localtime', '-5 hours')
        GROUP BY c.categoria_id, c.nombre;
    `;
    } else {
      query = `${baseQuery}
        WHERE DATE(pe.fecha_hora) <= ?
         GROUP BY c.categoria_id, c.nombre;
      `;
      queryParams = [date_interval];
    }

    const result = await connection.execute({
      sql: query,
      args: queryParams
    });

    const rows = result.rows;
    const categorias = [];
    rows.forEach(row => {

      const categoria = new Categoria(row.categoria_id, row.nombre);
      const categoria_total = {
        'id': categoria.id,
        'nombre': categoria.nombre,
        'total': row.total
      }
      categorias.push(categoria_total);
    });
    return { success: true, data: categorias }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  get_categorias,
  post_categoria,
  get_categoria_by_id,
  put_categoria,
  delete_categoria,
  get_ranking_categorias
}
