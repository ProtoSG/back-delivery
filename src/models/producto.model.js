class Producto {
  constructor(id, nombre, precio, descripcion, imagen_url, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen_url = imagen_url;
    this.categoria = categoria;
  }
}

module.exports = Producto;
