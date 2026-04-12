const db = require('../config/database');

class ModeloLearningPaths {
    
    static async getAllLearningPaths() {
      const resultados = await db.query('SELECT * FROM Learning_Paths');
      return resultados;
    }

    static async getLearningPathByID(id) {
      const resultados = await db.query('SELECT * FROM Learning_Paths WHERE id_area = $1', [id]);
      return resultados;
    }

    static async deleteLearningPathByID(id) {
      const resultados = await db.query('DELETE FROM Learning_Paths WHERE id_area = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloLearningPaths;