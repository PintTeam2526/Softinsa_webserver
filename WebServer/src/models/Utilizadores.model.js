const db = require('../config/database');

class ModeloUtilizador {
    
    static async getAllUsers() {
      const resultados = await db.query('SELECT * FROM utilizadores');
      return resultados;
    }
}

module.exports = ModeloUtilizador;