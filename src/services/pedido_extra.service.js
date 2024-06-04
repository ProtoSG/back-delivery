const { connection } = require('../database/connection.db');
const Pedido_Extra = require('../models/pedido_extra.model');

const get_pedido_extras = async () => {  // get_pedido_extras
  try {
    const { rows } = await connection.execute('SELECT * FROM Pedido_Extra');
    const pedido_extras = [];
    rows.forEach(row => {
      const pedido_extra = new Pedido_Extra(row.pedido_id, row.extra_id, row.cantidad, row.sub_total);
      pedido_extras.push(pedido_extra);
    });
    return { success: true, data: pedido_extras }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const post_pedido_extra = async (pedido_id, extra_id, cantidad, sub_total) => {  // post_pedido_extra
  const query = 'INSERT INTO Pedido_Extra (pedido_id, extra_id, cantidad, sub_total) VALUES (?, ?, ?, ?)';
  await connection.execute({
    sql: query,
    args: [pedido_id, extra_id, cantidad, sub_total]
  });
}

const get_pedido_extra_by_id = async (pedido_id) => {  // get_pedido_extra_by_id
  try {
    const query = 'SELECT * FROM Pedido_Extra WHERE pedido_id';
    const { rows } = await connection.execute({
      sql: query,
      args: [pedido_id]
    });
    if (rows.length === 0) {
      return false, 'Pedido_Extra no encontrado';
    }
    const { cantidad, sub_total } = rows[0];
    const pedido_extra = new Pedido_Extra(pedido_id, extra_id, cantidad, sub_total);
    return { success: true, data: pedido_extra }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_ranking_extras = async (date) => {
  try {
    const date_intervals = {
      'semana': "date('now', '-7 day', 'localtime', '-5 hours')",
      'mes': "date('now', '-1 month', 'localtime', '-5 hours')",
      'año': "date('now', '-1 year', 'localtime', '-5 hours')"
    };

    const date_interval = date_intervals[date];

    const baseQuery = `
      SELECT e.extra_id, e.nombre, SUM(pe.cantidad) AS cantidad_ventas
      FROM Pedido_Extra pe
      JOIN Extra e ON pe.extra_id = e.extra_id
      JOIN Pedido p ON pe.pedido_id = p.pedido_id
    `;

    let query = "";
    let queryParams = [];

    if (date === 'dia') {
      query = `${baseQuery}
        WHERE DATE(p.fecha_hora) = DATE('now', 'localtime', '-5 hours')
        GROUP BY pe.extra_id, e.nombre
    `;
    } else {
      query = `${baseQuery}
        WHERE DATE(p.fecha_hora) <= ?
        GROUP BY pe.extra_id, e.nombre
      `;
      queryParams = [date_interval];
    }

    const result = await connection.execute({
      sql: query,
      args: queryParams
    });

    const rows = result.rows;

    const pedido_extras = [];
    rows.forEach(row => {
      const pedido_extra = {
        extra_id: row.extra_id,
        nombre: row.nombre,
        cantidad: row.total
      }
      pedido_extras.push(pedido_extra);
    });

    return { success: true, data: rows }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  get_pedido_extras,
  post_pedido_extra,
  get_pedido_extra_by_id,
  get_ranking_extras
}
