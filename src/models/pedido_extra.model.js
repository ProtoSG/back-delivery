class Pedido_Extra {
  constructor(pedido_id, extra_id, cantidad, sub_total) {
    this.pedido_id = pedido_id;
    this.extra_id = extra_id;
    this.cantidad = cantidad;
    this.sub_total = sub_total;
  }
}

module.exports = Pedido_Extra;
