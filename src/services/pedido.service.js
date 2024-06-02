const { connection } = require('../database/connection.db');
const Pedido = require('../models/pedido.model');

const { post_pedido_extra } = require('./pedido_extra.service');
const { post_pedido_producto } = require('./pedido_producto.service');

const get_pedidos = async () => {
  try {
    const { rows } = await connection.execute('SELECT * FROM Pedido');
    const pedidos = [];
    rows.forEach(row => {
      const pedido = new Pedido(row.pedido_id, row.total, row.fecha_hora);
      pedidos.push(pedido);
    });
    return { success: true, data: pedidos }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const post_pedido = async (pedido, productos, extras) => {
  try {
    const query = 'INSERT INTO Pedido (total, fecha_hora) VALUES (?, ?)';
    const { lastInsertRowid } = await connection.execute({
      sql: query,
      args: [pedido.total, pedido.fecha_hora]
    });
    const id = Number(lastInsertRowid)
    productos.forEach(producto => {
      post_pedido_producto(id, producto.id, producto.cantidad, producto.subtotal);
    });
    extras.forEach(extra => {
      post_pedido_extra(id, extra.id, extra.cantidad, extra.subtotal);
    });

    return { success: true, message: 'Pedido creado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_pedido_by_id = async (pedido_id) => {
  try {
    const query = 'SELECT * FROM Pedido WHERE pedido_id = ?';
    const { rows } = await connection.execute({
      sql: query,
      args: [pedido_id]
    });
    if (rows.length === 0) {
      return false, 'Pedido no encontrado';
    }
    const { total, fecha_hora } = rows[0];
    const pedido = new Pedido(pedido_id, total, fecha_hora);
    return { success: true, data: pedido }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_ranking_productos = async (date) => { // date: YYYY-MM-DD
  try {
    const date_intervals = {
      'dia': "date('now', 'localhost', '-5 hours')",
      'semana': "date('now', '-7 day', 'localtime', '-5 hours')",
      'mes': "date('now', '-1 month', 'localtime', '-5 hours')",
      'año': "date('now', '-1 year', 'localtime', '-5 hours')"
    };
    const date_interval = date_intervals[date];
    const query = `
      SELECT pp.producto_id, p.nombre, SUM(pp.cantidad) AS cantidad
      FROM Pedido p
      JOIN Pedido_Producto pp ON p.pedido_id = pp.pedido_id
      WHERE DATE(p.fecha_hora) <= ?
      GROUP BY pp.producto_id
      ORDER BY cantidad DESC;
    `
    const { rows } = await connection.execute({
      sql: query,
      args: [date_interval]
    });
    const ranking = [];
    rows.forEach(row => {
      ranking.push({ producto_id: row.producto_id, nombre: row.nombre, cantidad: row.cantidad });
    });
    return { success: true, data: ranking }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  get_pedidos,
  post_pedido,
  get_pedido_by_id,
  get_ranking_productos
}
