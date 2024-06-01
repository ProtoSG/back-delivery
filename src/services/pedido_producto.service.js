const { connection } = require('../database/connection.db');
const Pedido_Producto = require('../models/pedido_producto.model');

const get_pedido_producto_by_id = async (pedido_id) => {
  try {
    const query = 'SELECT * FROM Pedido_Producto WHERE pedido_id = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [pedido_id]
    });
    if (rows.length === 0) {
      return false, 'Pedido no encontrado';
    }
    const { producto_id, cantidad, sub_total } = rows[0];
    const pedido_producto = new Pedido_Producto(pedido_id, producto_id, cantidad, sub_total);
    return { success: true, data: pedido_producto }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const post_pedido_producto = async (pedido_id, producto_id, cantidad, sub_total) => {
  const query = 'INSERT INTO Pedido_Producto (pedido_id, producto_id, cantidad, sub_total) VALUES (?, ?, ?, ?)';
  await connection.execute({
    sql: query,
    args: [pedido_id, producto_id, cantidad, sub_total]
  });
}

const get_ranking_productos = async (date) => {
  try {
    const date_intervals = {
      'dia': "date('now', 'localhost', '-5 hours')",
      'semana': "date('now', '-7 day', 'localtime', '-5 hours')",
      'mes': "date('now', '-1 month', 'localtime', '-5 hours')",
      'año': "date('now', '-1 year', 'localtime', '-5 hours')"
    };

    const date_interval = date_intervals.get(date);

    var query = ""
    if (date === 'dia') {
      query = `
        SELECT p.producto_id, p.nombre, COUNT(*) AS cantidad_ventas, SUM(pp.sub_total) AS total_ventas
        FROM Pedido_Producto pp
        JOIN Producto p ON pp.producto_id = p.producto_id
        JOIN Pedido pe ON pp.pedido_id = pe.pedido_id
        WHERE DATE(pe.fecha_hora) = ?
        GROUP BY pp.producto_id, p.nombre
        ORDER BY cantidad_ventas DESC;
    `;
    } else {
      query = `
        SELECT p.producto_id, p.nombre, COUNT(*) AS cantidad_ventas, SUM(pp.sub_total) AS total_ventas
        FROM Pedido_Producto pp
        JOIN Producto p ON pp.producto_id = p.producto_id
        JOIN Pedido pe ON pp.pedido_id = pe.pedido_id
        WHERE DATE(pe.fecha_hora) <= ?
        GROUP BY pp.producto_id, p.nombre
        ORDER BY cantidad_ventas DESC;
      `;
    }
    const { rows } = await connection.execute({
      sql: query,
      args: [date_interval]
    });
    const ranking = [];
    rows.forEach(row => {
      ranking.push({
        producto_id: row.producto_id,
        nombre: row.nombre,
        cantidad: row.cantidad_ventas,
        total: row.total_ventas
      });
    });
    return { success: true, data: ranking }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  get_pedido_producto_by_id,
  post_pedido_producto,
  get_ranking_productos
}
