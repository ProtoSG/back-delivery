const { connection } = require('../database/connection.db')

const getAllCategorias = async () => {
  const { rows } = await connection.execute('SELECT * FROM Categoria');
  return rows;
}

module.exports = { getAllCategorias }
