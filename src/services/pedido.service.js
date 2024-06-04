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

const get_ranking_productos_dias = async () => {
  try {
    const query = `
      SELECT DATE(fecha_hora) AS fecha, SUM(total) AS total_ventas
      FROM Pedido
      WHERE fecha_hora >= datetime('now', '-7 day', '-5 hours')
      GROUP BY DATE(fecha_hora);
    `
    const { rows: datos } = await connection.execute(query);

    datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const fechaFin = new Date() - 5 * 60 * 60 * 1000;
    const fechaInicio = new Date(fechaFin) - 6 * 24 * 60 * 60 * 1000;

    const datosMap = new Map(datos.map(dato => [dato.fecha, dato.total_ventas]));

    const fechasCompletas = [];
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      const fechaStr = fecha.toISOString().split('T')[0];
      fechasCompletas.push({
        time: fechaStr,
        value: datosMap.get(fechaStr) || 0
      });
    }

    return { success: true, data: fechasCompletas }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const get_ranking_productos_semanas = async () => {
  const query = `
    SELECT strftime('%Y-%W', fecha_hora) AS semana, SUM(total) AS total_ventas
    FROM Pedido
    GROUP BY strftime('%Y-%W', fecha_hora);
  `;
  const { rows: datos } = await connection.execute(query);

  function getFirstDayOfWeek(semana) {
    const [year, week] = semana.split('-').map(Number);
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = date.getDay();
    const ISOweekStart = dayOfWeek <= 4 ? date.getDate() - dayOfWeek + 1 : date.getDate() + 8 - dayOfWeek;
    date.setDate(ISOweekStart);
    return date.toISOString().split('T')[0];
  }

  // Crear un objeto para almacenar ventas por semana
  const ventasPorSemana = {};

  datos.forEach(dato => {
    if (dato.semana) {
      ventasPorSemana[dato.semana] = dato.total_ventas;
    }
  });

  // Obtener el rango de semanas existentes
  const semanasPresentes = Object.keys(ventasPorSemana).map(semana => ({
    year: parseInt(semana.split('-')[0]),
    week: parseInt(semana.split('-')[1])
  }));

  const minYear = Math.min(...semanasPresentes.map(s => s.year));
  const maxYear = Math.max(...semanasPresentes.map(s => s.year));

  let rangoSemanas = [];

  for (let year = minYear; year <= maxYear; year++) {
    const weeksInYear = year === maxYear ? Math.max(...semanasPresentes.filter(s => s.year === year).map(s => s.week)) : 52;
    const startWeek = year === minYear ? Math.min(...semanasPresentes.filter(s => s.year === year).map(s => s.week)) : 1;
    for (let week = startWeek; week <= weeksInYear; week++) {
      rangoSemanas.push(`${year}-${String(week).padStart(2, '0')}`);
    }
  }

  const ventasCompletadas = rangoSemanas.map(semana => ({
    time: getFirstDayOfWeek(semana),
    value: ventasPorSemana[semana] || 0
  }));


  return { success: true, data: ventasCompletadas }

}

const get_ranking_productos_meses = async () => {
  const query = `
    SELECT strftime('%Y-%m', fecha_hora) AS mes, SUM(total) AS total_ventas
    FROM Pedido
    GROUP BY strftime('%Y-%m', fecha_hora);
  `;

  const { rows: datos } = await connection.execute(query);

  const ventasPorMes = {};
  datos.forEach(dato => {
    if (dato.mes) {
      ventasPorMes[dato.mes] = dato.total_ventas;
    }
  });

  const mesesPresentes = Object.keys(ventasPorMes).map(mes => ({
    year: parseInt(mes.split('-')[0]),
    month: parseInt(mes.split('-')[1])
  }));

  const minYear = Math.min(...mesesPresentes.map(m => m.year));

  const maxYear = Math.max(...mesesPresentes.map(m => m.year));

  let rangoMeses = [];

  for (let year = minYear; year <= maxYear; year++) {
    const monthsInYear = year === maxYear ? Math.max(...mesesPresentes.filter(m => m.year === year).map(m => m.month)) : 12;
    const startMonth = year === minYear ? Math.min(...mesesPresentes.filter(m => m.year === year).map(m => m.month)) : 1;
    for (let month = startMonth; month <= monthsInYear; month++) {
      rangoMeses.push(`${year}-${String(month).padStart(2, '0')}`);
    }
  }

  const ventasCompletadas = rangoMeses.map(mes => ({
    time: `${mes}-01`,
    value: ventasPorMes[mes] || 0
  }));

  return { success: true, data: ventasCompletadas }
}

const get_ranking_productos_anios = async () => {
  const query = `
  SELECT strftime('%Y', fecha_hora) AS año, SUM(total) AS total_ventas
                FROM Pedido
                GROUP BY strftime('%Y', fecha_hora);
  `;

  const { rows: datos } = await connection.execute(query);

  const ventasPorAnio = {};

  datos.forEach(dato => {
    if (dato.año) {
      ventasPorAnio[dato.año] = dato.total_ventas;
    }
  });

  const añosPresentes = Object.keys(ventasPorAnio);

  const minYear = Math.min(...añosPresentes);
  const maxYear = Math.max(...añosPresentes);

  let rangoAños = [];

  for (let year = minYear; year <= maxYear; year++) {
    rangoAños.push(year);
  }

  const ventasCompletadas = rangoAños.map(año => ({
    time: `${año}-01-01`,
    value: ventasPorAnio[año] || 0
  }));

  return { success: true, data: ventasCompletadas }
}

module.exports = {
  get_pedidos,
  post_pedido,
  get_pedido_by_id,
  get_ranking_productos_dias,
  get_ranking_productos_semanas,
  get_ranking_productos_meses,
  get_ranking_productos_anios
}
