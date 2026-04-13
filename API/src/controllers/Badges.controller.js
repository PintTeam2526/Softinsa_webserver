const db = require('../models/database');

class ModeloBadges {
    
    static async getAllBadges() {
      const resultados = await db.query('SELECT * FROM Badges');
      return resultados;
    }

    static async getBadgeByID(id) {
      const resultados = await db.query('SELECT * FROM Badges WHERE id_utilizador = $1', [id]);
      return resultados;
    }

    static async deleteBadgeByID(id) {
      const resultados = await db.query('DELETE FROM Badges WHERE id_utilizador = $1', [id]);
      return resultados;
    }


}

module.exports = ModeloBadges;