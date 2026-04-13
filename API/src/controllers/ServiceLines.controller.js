const db = require('../models/database');

class ModeloServiceLines {
    
    static async getAllServiceLines() {
      const resultados = await db.query('SELECT * FROM Service_Lines');
      return resultados;
    }

    static async getServiceLineByID(id) {
      const resultados = await db.query('SELECT * FROM Service_Lines WHERE id_area = $1', [id]);
      return resultados;
    }

    static async deleteServiceLineByID(id) {
      const resultados = await db.query('DELETE FROM Service_Lines WHERE id_area = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloServiceLines;
