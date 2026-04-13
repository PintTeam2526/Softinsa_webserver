const db = require('../models/database');

class ModeloConquistas {
    
    static async getAllConquistas() {
      const resultados = await db.query('SELECT * FROM Conquistas');
      return resultados;
    }

    static async getConquistaByID(id) {
      const resultados = await db.query('SELECT * FROM Conquistas WHERE id_utilizador = $1', [id]);
      return resultados;
    }

    static async deleteConquistaByID(id) {
      const resultados = await db.query('DELETE FROM Conquistas WHERE id_utilizador = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloConquistas;