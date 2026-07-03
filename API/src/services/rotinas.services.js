const cron = require('node-cron');
const { Op } = require('sequelize');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Badges = require('../models/Badges.models');
const Notificacoes = require('../models/Notificacoes.models');
const Consultores = require('../models/Consultores.models');
const Utilizadores = require('../models/Utilizadores.models');
const { enviarEmailBadgeExpirado } = require('./email.service');

function iniciarExpiracaoBadges() {
  cron.schedule('0 11 * * *', async () => {
    console.log(`[${new Date().toISOString()}] A verificar badges expirados...`);

    try {
      const concluidos = await BadgesConcluidos.findAll({
        include: [
          { model: Badges, attributes: ['sla', 'nome_badge'] },
          {
            model: Consultores,
            include: [{ model: Utilizadores, attributes: ['nome_utilizador', 'email_utilizador'] }]
          }
        ],
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

          await Notificacoes.create({
            id_consultor: concluido.id_consultor,
            notificacao: "Badge expirado",
            descricao: `O teu badge expirou e foi removido. Podes submeter um novo pedido para o reobter.`,
            remetente: "Sistema",
            data_de_envio: new Date()
          });

          try {
            const utilizador = concluido.Consultor?.Utilizadore;
            if (utilizador) {
              await enviarEmailBadgeExpirado(
                utilizador.email_utilizador,
                utilizador.nome_utilizador,
                concluido.Badge.nome_badge
              );
            }
          } catch (emailError) {
            console.error(`Erro ao enviar email de expiração para consultor ${concluido.id_consultor}:`, emailError.message);
          }
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
  }, {
    timezone: 'Europe/Lisbon'  // trata WET/WEST automaticamente
  });

  console.log('Job de expiração de badges iniciado.');
}

module.exports = iniciarExpiracaoBadges;