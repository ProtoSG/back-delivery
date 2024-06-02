const { connection } = require('../database/connection.db');
const Categoria = require('../models/categoria.model');
const Producto = require('../models/producto.model');

const get_productos = async () => {
  try {
    const query = `
      SELECT p.producto_id, p.nombre, p.precio, p.descripcion, p.imagen_url, c.categoria_id, c.nombre AS nombre_categoria
      FROM Producto p
      JOIN Categoria c ON p.categoria_id = c.categoria_id;
    `
    const { rows } = await connection.execute(query);
    const productos = [];
    rows.forEach(row => {
      const categoria = new Categoria(row.categoria_id, row.nombre_categoria);
      const producto = new Producto(row.producto_id, row.nombre, row.precio, row.descripcion, row.imagen_url, categoria);
      productos.push(producto);
    });
    return { success: true, data: productos }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const post_producto = async ({ nombre, precio, descripcion, imagen_url, categoria_id }) => {
  try {
    const query = 'INSERT INTO Producto (nombre, precio, descripcion, imagen_url, categoria_id) VALUES (?, ?, ?, ?, ?)';
    await connection.execute({
      sql: query,
      args: [nombre, precio, descripcion, imagen_url, categoria_id]
    });
    return { success: true, message: 'Producto creado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_producto_by_id = async (producto_id) => {
  try {
    const query = `
      SELECT p.producto_id, p.nombre, p.precio, p.descripcion, p.imagen_url, c.categoria_id, c.nombre AS nombre_categoria
      FROM Producto p
      JOIN Categoria c ON p.categoria_id = c.categoria_id
      WHERE p.producto_id = ?;
    `
    const { rows } = await connection.execute({
      sql: query,
      args: [producto_id]
    });
    if (rows.length === 0) {
      return false, 'Producto no encontrado';
    }
    const { nombre, precio, descripcion, imagen_url, categoria_id, nombre_categoria } = rows[0];
    const categoria = new Categoria(categoria_id, nombre_categoria);
    const producto = new Producto(producto_id, nombre, precio, imagen_url, categoria);
    return { success: true, data: producto }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const put_producto = async ({ id, nombre, precio, descripcion, imagen_url, categoria_id }) => {
  try {
    const query = 'UPDATE Producto SET nombre = ?, precio = ?, descripcion = ?, imagen_url = ?, categoria_id = ? where producto_id = ?';
    await connection.execute({
      sql: query, args: [nombre, precio, descripcion, imagen_url, categoria_id, id]
    });
    return { success: true, message: 'Producto actualizado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const delete_producto = async (producto_id) => {
  try {
    const query = 'DELETE FROM Producto WHERE producto_id = ?';
    await connection.execute({
      sql: query,
      args: [producto_id]
    });
    return { success: true, message: 'Producto eliminado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  get_productos,
  post_producto,
  get_producto_by_id,
  put_producto,
  delete_producto
}
