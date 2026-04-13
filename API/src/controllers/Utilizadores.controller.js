const db = require('../models/database');

class ModeloUtilizador {
    
    static async getAllUsers() {
      const resultados = await db.query('SELECT * FROM utilizadores');
      return resultados;
    }

    static async getUserByID(id) {
      const resultados = await db.query('SELECT * FROM utilizadores WHERE id_utilizador = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloUtilizador;