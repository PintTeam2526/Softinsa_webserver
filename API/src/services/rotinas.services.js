const cron = require('node-cron');
const { Op } = require('sequelize');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Badges = require('../models/Badges.models');

function iniciarExpiracaoBadges() {
  // Executa todos os dias à meia-noite
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] A verificar badges expirados...`);

    try {
      // Buscar todos os badges concluídos com o badge associado
      const concluidos = await BadgesConcluidos.findAll({
        include: [{ model: Badges, attributes: ['sla'] }],
      });

      const agora = new Date();
      const idsExpirados = [];

      for (const concluido of concluidos) {
        const sla = concluido.Badge?.sla;
        if (!sla) continue;

        const dataExpiracao = new Date(concluido.data_conclusao_badge);
        dataExpiracao.setDate(dataExpiracao.getDate() + sla);

        if (agora >= dataExpiracao) {
          idsExpirados.push(concluido.id_badge_concluido);
        }
      }

      if (idsExpirados.length === 0) {
        console.log('Nenhum badge expirado encontrado.');
        return;
      }

      await BadgesConcluidos.destroy({
        where: { id_badge_concluido: { [Op.in]: idsExpirados } },
      });

      console.log(`${idsExpirados.length} badge(s) expirado(s) removido(s).`);
    } catch (error) {
      console.error('Erro ao verificar badges expirados:', error.message);
    }
  });

  console.log('Job de expiração de badges iniciado.');
}

module.exports = iniciarExpiracaoBadges;