const db = require('../models/database');

class ModeloPedidos {
    
    static async getAllPedidos() {
      const resultados = await db.query('SELECT * FROM Pedidos');
      return resultados;
    }

    static async getPedidoByID(id) {
      const resultados = await db.query('SELECT * FROM Pedidos WHERE id_area = $1', [id]);
      return resultados;
    }

    static async deletePedidoByID(id) {
      const resultados = await db.query('DELETE FROM Pedidos WHERE id_area = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloPedidos;