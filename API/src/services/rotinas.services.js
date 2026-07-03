const cron = require('node-cron');
const { Op } = require('sequelize');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Badges = require('../models/Badges.models');
const Notificacoes = require('../models/Notificacoes.models');
const Consultores = require('../models/Consultores.models');
const Utilizadores = require('../models/Utilizadores.models');
const { enviarEmailBadgeExpirado } = require('./email.service');

async function executar() {
    console.log(`[${new Date().toISOString()}] A verificar badges expirados...`);

    try {
        const concluidos = await BadgesConcluidos.findAll({
            include: [
                { model: Badges, attributes: ['sla', 'nome_badge'] },
                {
                    model: Consultores,
                    include: [{
                        model: Utilizadores,
                        attributes: ['nome_utilizador', 'email_utilizador']
                    }]
                }
            ],
        });

        const agora = new Date();

        // Identificar badges expirados
        // sla é o número de dias após a conclusão até expirar (incluindo sla = 0 = expira no próprio dia)
        const expirados = concluidos.filter(concluido => {
            const sla = concluido.Badge?.sla;
            if (sla === null || sla === undefined) return false;

            const dataExpiracao = new Date(concluido.data_conclusao_badge);
            dataExpiracao.setDate(dataExpiracao.getDate() + sla);

            return agora >= dataExpiracao;
        });

        if (expirados.length === 0) {
            console.log('Nenhum badge expirado encontrado.');
            return;
        }

        console.log(`${expirados.length} badge(s) expirado(s) encontrado(s). A remover...`);

        // 1. Remover os badges expirados da tabela
        const idsExpirados = expirados.map(c => c.id_badge_concluido);
        await BadgesConcluidos.destroy({
            where: { id_badge_concluido: { [Op.in]: idsExpirados } },
        });

        console.log(`${idsExpirados.length} badge(s) removido(s) com sucesso.`);

        // 2. Só DEPOIS de confirmar a remoção, notificar os utilizadores
        // Agrupar por consultor para evitar múltiplos emails se tiver mais do que 1 badge expirado
        const porConsultor = {};
        for (const concluido of expirados) {
            const id = concluido.id_consultor;
            if (!porConsultor[id]) {
                porConsultor[id] = {
                    consultor: concluido.Consultor,
                    badges: []
                };
            }
            porConsultor[id].badges.push(concluido.Badge.nome_badge);
        }

        for (const [idConsultor, dados] of Object.entries(porConsultor)) {
            const nomesBadges = dados.badges.join(', ');
            const utilizador = dados.consultor?.Utilizadore;

            // Notificação na plataforma
            try {
                await Notificacoes.create({
                    id_consultor: parseInt(idConsultor),
                    notificacao: "Badge(s) expirado(s)",
                    descricao: `Os seguintes badges expiraram e foram removidos: ${nomesBadges}. Podes submeter novos pedidos para os reobter.`,
                    remetente: "Sistema",
                    data_de_envio: new Date()
                });
            } catch (notifError) {
                console.error(`Erro ao criar notificação para consultor ${idConsultor}:`, notifError.message);
            }

            // Email
            try {
                if (utilizador?.email_utilizador) {
                    await enviarEmailBadgeExpirado(
                        utilizador.email_utilizador,
                        utilizador.nome_utilizador,
                        nomesBadges
                    );
                }
            } catch (emailError) {
                console.error(`Erro ao enviar email para consultor ${idConsultor}:`, emailError.message);
            }
        }

        console.log(`Notificações e emails enviados para ${Object.keys(porConsultor).length} consultor(es).`);

    } catch (error) {
        console.error('Erro ao verificar badges expirados:', error.message);
    }
}

function iniciarExpiracaoBadges() {
    // Executa todos os dias às 11h de Lisboa (trata WET/WEST automaticamente)
    cron.schedule('0 11 * * *', executar, {
        timezone: 'Europe/Lisbon'
    });

    console.log('Job de expiração de badges iniciado. (Próxima execução: 11h Lisboa)');
    executar()
}

module.exports = iniciarExpiracaoBadges;