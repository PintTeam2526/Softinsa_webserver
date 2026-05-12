const sequelize = require('../../database');

const Badges = require('../models/Badges.models');
const Areas = require('../models/Areas.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const TalentManagers = require('../models/TalentManagers.models');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');
const HistoricoPedidos = require('../models/HistoricoPedidos.models');
const Documentacoes = require('../models/Documentacoes.models');
const NotificacoesPedidos = require('../models/NotificacoesPedidos.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');

async function submeterCandidatura({
    id_consultor,
    id_badge,
    documentos
}) {

    const transaction = await sequelize.transaction();

    try {

        // Remover badge concluído anterior
        await BadgesConcluidos.destroy({
            where: {
                id_consultor,
                id_badge
            },
            transaction
        });

        // Verificar se já existe pedido
        let pedido =
            await PedidosBadges.findOne({
                where: {
                    id_consultor,
                    id_badge
                },
                transaction
            });

        // Se NÃO existir pedido
        if (!pedido) {

            // Escolher talent manager com menos pedidos
            const talentManagers =
                await TalentManagers.findAll({
                    transaction
                });

            let tmEscolhido = null;
            let menorNumeroPedidos = Infinity;

            for (const tm of talentManagers) {

                const totalPedidos =
                    await PedidosBadges.count({
                        where: {
                            id_talent_manager: tm.id_talent_manager
                        },
                        transaction
                    });

                if (totalPedidos < menorNumeroPedidos) {
                    menorNumeroPedidos = totalPedidos;
                    tmEscolhido = tm.id_talent_manager;
                }
            }

            // Buscar badge
            const badge =
                await Badges.findByPk(id_badge, {
                    transaction
                });

            if (!badge) {
                throw new Error(
                    'Badge não encontrado'
                );
            }

            // Buscar área
            const area =
                await Areas.findByPk(
                    badge.id_area,
                    {
                        transaction
                    }
                );

            // Buscar service line lider
            const serviceLineLider =
                await ServiceLineLiders.findOne({
                    where: {
                        id_service_line: area.id_service_line
                    },
                    transaction
                });

            if (!serviceLineLider) {
                throw new Error(
                    'Service Line Líder não encontrado'
                );
            }

            // Criar pedido
            pedido =
                await PedidosBadges.create(
                    {
                        id_consultor,
                        id_talent_manager: tmEscolhido,
                        id_service_line_lider: serviceLineLider.id_service_line_lider,
                        id_badge,
                        estado_atual: 1
                    },
                    {
                        transaction
                    }
                );

        } else {

            // Se já existir um pedido com o mesmo utilizador e badge nao cria um novo, atualiza o existente
            // Só cria novo histórico, documentaçao e notificação
            await pedido.update(
                {
                    estado_atual: 1
                },
                {
                    transaction
                }
            );
        }

        // Criar histórico
        const historico =
            await HistoricoPedidos.create(
                {
                    id_estado: 1,
                    id_utilizador_avaliador: 1,
                    id_pedido_badge: pedido.id_pedido_badge,
                    data: new Date(),
                    estado_objetivo: 'Submetido'
                },
                {
                    transaction
                }
            );

        // Guardar documentos
        for (const documento of documentos) {
            await Documentacoes.create(
                {
                    id_pedido_badge: pedido.id_pedido_badge,
                    id_consultor,
                    documentacao: documento,
                    validado: null
                },
                {
                    transaction
                }
            );
        }

        // Criar notificação
        await NotificacoesPedidos.create(
            {
                id_consultor,
                id_pedido_badge: pedido.id_pedido_badge,
                justificacao: 'Candidatura submetida. Aguarda validação.',
                data_envio_notificacao: new Date()
            },
            {
                transaction
            }
        );

        await transaction.commit();

        return {
            success: true,
            message: 'Candidatura submetida com sucesso'
        };

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

module.exports = {submeterCandidatura};

