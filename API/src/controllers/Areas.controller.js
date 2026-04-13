const db = require('../config/database');

class ModeloAreas {
    
    static async getAllAreas() {
      const resultados = await db.query('SELECT * FROM Areas');
      return resultados;
    }

    static async getAreaByID(id) {
      const resultados = await db.query('SELECT * FROM Areas WHERE id_area = $1', [id]);
      return resultados;
    }

    static async deleteAreaByID(id) {
      const resultados = await db.query('DELETE FROM Areas WHERE id_area = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloAreas;
