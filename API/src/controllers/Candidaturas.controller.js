const sequelize = require('../../database');
const DocumentacaoTemporaria = require('../models/DocumentacaoTemporaria.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Badges = require('../models/Badges.models');
const Areas = require('../models/Areas.models');
const TalentManagers = require('../models/TalentManagers.models');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');
const HistoricoPedidos = require('../models/HistoricoPedidos.models');
const Documentacoes = require('../models/Documentacoes.models');
const NotificacoesPedidos = require('../models/Notificacoes.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const firebase = require('../services/firebase.service');

const controllers = {};

// Inserir documentação individualmente (Mobile/Web)
controllers.inserirDocumentacaoBadge = async (req, res) => {
    try {
        const { documentacao, sessaoId } = req.body;

        if (!documentacao || !sessaoId) {
            return res.status(400).json({
                error: "É necessário enviar a documentação em base64 e o sessaoId"
            });
        }

        // Criar registo temporário (guarda a string Base64 diretamente)
        await DocumentacaoTemporaria.create({
            sessao_id: sessaoId,
            documentacao: documentacao
        });

        // Contar quantos ficheiros já existem para esta sessão
        const totalFicheiros = await DocumentacaoTemporaria.count({
            where: { sessao_id: sessaoId }
        });

        res.status(200).json({
            success: true,
            sessaoId: sessaoId,
            totalFicheiros: totalFicheiros
        });

    } catch (err) {
        console.error("Erro ao enviar documentacao: ", err);
        res.status(500).json({ error: "Erro ao enviar documentacao", details: err.message });
    }
};

// Finalizar a candidatura ao badge
controllers.candidatarBadge = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { idConsultor, SessaoID, idBadge } = req.body;

        if (!idConsultor || !SessaoID || !idBadge) {
            return res.status(400).json({
                error: "Tens de enviar no body: idConsultor, SessaoID, idBadge"
            });
        }

        // 1. Remover badge concluído anterior se existir
        await BadgesConcluidos.destroy({
            where: { id_consultor: idConsultor, id_badge: idBadge },
            transaction
        });

        // 2. Verificar se já existe um pedido
        let pedido = await PedidosBadges.findOne({
            where: { id_consultor: idConsultor, id_badge: idBadge },
            transaction
        });

        if (!pedido) {
            // Escolher Talent Manager com menos pedidos
            const talentManagers = await TalentManagers.findAll({ transaction });
            let tmEscolhido = null;
            let menorNumeroPedidos = Infinity;

            for (const tm of talentManagers) {
                const totalPedidos = await PedidosBadges.count({
                    where: { id_talent_manager: tm.id_talent_manager },
                    transaction
                });

                if (totalPedidos < menorNumeroPedidos) {
                    menorNumeroPedidos = totalPedidos;
                    tmEscolhido = tm.id_talent_manager;
                }
            }

            // Buscar badge e área para encontrar o Service Line Lider
            const badge = await Badges.findByPk(idBadge, { transaction });
            if (!badge) throw new Error('Badge não encontrado');

            const area = await Areas.findByPk(badge.id_area, { transaction });
            const serviceLineLider = await ServiceLineLiders.findOne({
                where: { id_service_line: area.id_service_line },
                transaction
            });

            if (!serviceLineLider) throw new Error('Service Line Líder não encontrado');

            // Criar novo pedido
            pedido = await PedidosBadges.create({
                id_consultor: idConsultor,
                id_talent_manager: tmEscolhido,
                id_service_line_lider: serviceLineLider.id_service_line_lider,
                id_badge: idBadge,
                estado_atual: 1
            }, { transaction });

        } else {
            // Atualizar pedido existente para estado "Submetido" (1)
            await pedido.update({ estado_atual: 1 }, { transaction });
        }

        // 3. Criar histórico
        const historico = await HistoricoPedidos.create({
            id_estado: 1,
            id_pedido_badge: pedido.id_pedido_badge,
            data: new Date()
        }, { transaction });

        if (!historico || !historico.id_historico) {
            throw new Error("Erro ao gerar ID do histórico do pedido");
        }

        // 4. Mover documentos da tabela temporária para a definitiva
        const docsTemporarios = await DocumentacaoTemporaria.findAll({
            where: { sessao_id: SessaoID },
            transaction
        });

        for (const doc of docsTemporarios) {
            await Documentacoes.create({
                id_historico: historico.id_historico,
                id_consultor: idConsultor,
                documentacao: doc.documentacao // A string já está em Base64
            }, { transaction });
        }

        // 5. Limpar documentos temporários
        await DocumentacaoTemporaria.destroy({
            where: { sessao_id: SessaoID },
            transaction
        });

        // 6. Criar notificação
        await NotificacoesPedidos.create({
            id_consultor: idConsultor,
            notificacao: 'Candidatura Submetida',
            descricao: 'A tua candidatura ao badge foi submetida e aguarda validação.',
            remetente: 'Sistema de Badges',
            data_de_envio: new Date()
        }, { transaction });
        await transaction.commit();
        firebase.notificarSync('pedidosBadge');
        res.status(200).json({ success: true, message: "Candidatura submetida com sucesso" });

    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error("Erro ao submeter candidatura ao badge: ", err);
        res.status(500).json({ error: "Erro ao submeter candidatura ao badge.", details: err.message });
    }
};

// Manter a rota original se for necessária
controllers.submeterCandidatura = async (req, res) => {
    const candidaturaService = require('../services/candidaturas.service');
    try {
        const resultado = await candidaturaService.submeterCandidatura(req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = controllers;