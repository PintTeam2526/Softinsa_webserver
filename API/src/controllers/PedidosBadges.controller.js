const Sequelize = require("sequelize");
const Pedidos = require("../models/PedidosBadges.models");
const HistoricoPedidos = require("../models/HistoricoPedidos.models");
const NotificacoesPedidos = require("../models/NotificacoesPedidos.models");
const BadgesConcluidos = require("../models/BadgesConcluidos.models");
const TalentManager = require("../models/TalentManagers.models");
const Badges = require("../models/Badges.models");
const Area = require("../models/Areas.models");
const ServiceLineLider = require("../models/ServiceLineLiders.models");

const controllers = {};

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function isAdmin(req) {
    return req.user?.role === "a";
}

function isTM(req) {
    return req.user?.role === "t";
}

function isSL(req) {
    return req.user?.role === "s";
}

function isConsultor(req) {
    return req.user?.role === "c";
}

async function criarHistorico(idPedido, idEstado, idUser, texto) {
    await HistoricoPedidos.create({
        id_pedido_badge: idPedido,
        id_estado: idEstado,
        id_utilizador_avaliador: idUser,
        data: new Date(),
        estado_objetivo: texto
    });
}

async function criarNotificacao(idConsultor, idPedido, texto) {
    await NotificacoesPedidos.create({
        id_consultor: idConsultor,
        id_pedido_badge: idPedido,
        justificacao: texto,
        data_envio_notificacao: new Date()
    });
}

async function escolherTalentManager() {
    const tms = await TalentManager.findAll();

    let melhorTM = null;
    let menorCarga = Infinity;

    for (const tm of tms) {
        const carga = await Pedidos.count({
            where: {
                id_talent_manager: tm.id_talent_manager,
                estado_atual: {
                    [Sequelize.Op.notIn]: [4, 5] // aprovado / rejeitado
                }
            }
        });

        if (carga < menorCarga) {
            menorCarga = carga;
            melhorTM = tm;
        }
    }

    return melhorTM;
}

/* =====================================================
   GET TODOS PEDIDOS
===================================================== */

controllers.getAllPedidos = async (req, res) => {
    try {
        console.log("REQ USER:", req.user);

        if (req.user.role === "guest") {
            return res.status(401).json({
                mensagem: "Utilizador não autenticado"
            });
        }

        let whereClause = {};

        if (isConsultor(req)) {
            console.log("É consultor");
            console.log("ID:", req.user.id);

            whereClause.id_consultor = req.user.id;
        }

        const pedidos = await Pedidos.findAll({
            where: whereClause
        });

        console.log("Filtro aplicado:", whereClause);

        return res.status(200).json(pedidos);

    } catch (error) {
        console.log("ERRO:", error);

        return res.status(500).json({
            mensagem: "Erro ao buscar pedidos",
            erro: error.message
        });
    }
};

/* =====================================================
   GET PEDIDO ID
===================================================== */

controllers.getPedidoById = async (req, res) => {
    try {
        if (req.user.role === "guest") {
            return res.status(401).json({
                mensagem: "Utilizador não autenticado"
            });
        }

        const pedido = await Pedidos.findByPk(req.params.id);

        if (!pedido) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado"
            });
        }

        return res.status(200).json(pedido);

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar pedido",
            erro: error.message
        });
    }
};

/* =====================================================
   CRIAR PEDIDO
===================================================== */

controllers.createPedido = async (req, res) => {
    try {
        if (!isConsultor(req) && !isAdmin(req)) {
            return res.status(403).json({
                mensagem: "Sem permissão para criar pedido"
            });
        }

        const { id_consultor, id_badge } = req.body;

        // 🔍 1. Verificar se o consultor já tem um pedido ativo para este badge
        const pedidoExistente = await Pedidos.findOne({
            where: {
                id_consultor: id_consultor,
                id_badge: id_badge,
                estado_atual: {
                    [Sequelize.Op.notIn]: [4, 5] // 4: Aprovado, 5: Rejeitado
                }
            }
        });

        if (pedidoExistente) {
            return res.status(400).json({
                mensagem: "Já possui um pedido em análise ou aberto para este badge."
            });
        }

        // 🤖 2. Escolher Talent Manager
        const tm = await escolherTalentManager();

        if (!tm) {
            return res.status(500).json({
                mensagem: "Nenhum Talent Manager disponível"
            });
        }

        // 🔍 3. Buscar Service Line Lider da área do badge
        const badge = await Badges.findByPk(id_badge);
        if (!badge) {
            return res.status(404).json({ mensagem: "Badge não encontrado" });
        }
        const area = await Area.findByPk(badge.id_area);
        if (!area) {
            return res.status(404).json({ mensagem: "Área não encontrada" });
        }
        const sl = await ServiceLineLider.findOne({ where: { id_service_line: area.id_service_line } });
        const idServiceLineLider = sl ? sl.id_service_line_lider : 1;

        // 📝 4. Criar o pedido
        const pedido = await Pedidos.create({
            id_consultor,
            id_talent_manager: tm.id_talent_manager,
            id_service_line_lider: idServiceLineLider,
            id_badge,
            estado_atual: 1
        });

        // 📜 5. Histórico e Notificação
        await criarHistorico(
            pedido.id_pedido_badge,
            1,
            req.user.id,
            "Pedido criado"
        );

        await criarNotificacao(
            id_consultor,
            pedido.id_pedido_badge,
            "Novo pedido criado. Aguarda validação."
        );

        return res.status(201).json({
            mensagem: "Pedido criado com sucesso",
            dados: pedido
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao criar pedido",
            erro: error.message
        });
    }
};


/* =====================================================
   TALENT MANAGER
===================================================== */
controllers.tmReview = async (req, res) => {
    try {
        if (!isTM(req) && !isAdmin(req)) {
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }

        const { acao } = req.body; // "aprovar" ou "devolver"

        const pedido = await Pedidos.findByPk(req.params.id);

        if (!pedido) {
            return res.status(404).json({
                mensagem: "Pedido não existe"
            });
        }

        let estado;
        let mensagemHistorico;
        let mensagemNotificacao;
        let mensagemResposta;

        if (acao === "aprovar") {
            estado = 2;
            mensagemHistorico = "Aprovado pelo Talent Manager";
            mensagemNotificacao = "Pedido aprovado pelo Talent Manager.";
            mensagemResposta = "Pedido aprovado";
        } else if (acao === "devolver") {
            estado = 3;
            mensagemHistorico = "Devolvido pelo Talent Manager";
            mensagemNotificacao = "Pedido devolvido pelo Talent Manager.";
            mensagemResposta = "Pedido devolvido";
        } else {
            return res.status(400).json({
                mensagem: "Ação inválida. Use 'aprovar' ou 'devolver'"
            });
        }

        pedido.estado_atual = estado;
        await pedido.save();

        await criarHistorico(
            pedido.id_pedido_badge,
            estado,
            req.user.id,
            mensagemHistorico
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            mensagemNotificacao
        );

        return res.status(200).json({
            mensagem: mensagemResposta
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao processar pedido",
            erro: error.message
        });
    }
};

/* =====================================================
   SERVICE LINE LIDER
===================================================== */

controllers.slReview = async (req, res) => {
    try {
        if (!isSL(req) && !isAdmin(req)) {
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }

        const { acao } = req.body; // "aprovar", "devolver", "rejeitar"

        const pedido = await Pedidos.findByPk(req.params.id);

        if (!pedido) {
            return res.status(404).json({
                mensagem: "Pedido não existe"
            });
        }

        const acoes = {
            aprovar: {
                estado: 4,
                historico: "Aprovado final",
                notificacao: "Pedido aprovado. Badge atribuído.",
                resposta: "Pedido aprovado com sucesso"
            },
            devolver: {
                estado: 6,
                historico: "Devolvido pelo Service Line Líder",
                notificacao: "Pedido devolvido pelo Service Line Líder.",
                resposta: "Pedido devolvido"
            },
            rejeitar: {
                estado: 5,
                historico: "Pedido rejeitado",
                notificacao: "Pedido rejeitado.",
                resposta: "Pedido rejeitado"
            }
        };

        const config = acoes[acao];

        if (!config) {
            return res.status(400).json({
                mensagem: "Ação inválida. Use 'aprovar', 'devolver' ou 'rejeitar'"
            });
        }

        // Atualizar estado
        pedido.estado_atual = config.estado;
        await pedido.save();

        // 🔥 Lógica extra apenas para aprovação
        if (acao === "aprovar") {
            await BadgesConcluidos.create({
                id_badge: pedido.id_badge,
                id_consultor: pedido.id_consultor,
                data_limite_conclusao: new Date(),
                data_conclusao_badge: new Date(),
                url_validacao: "Interno"
            });
        }

        // Histórico
        await criarHistorico(
            pedido.id_pedido_badge,
            config.estado,
            req.user.id,
            config.historico
        );

        // Notificação
        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            config.notificacao
        );

        return res.status(200).json({
            mensagem: config.resposta
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao processar pedido",
            erro: error.message
        });
    }
};

/* =====================================================
   CONSULTOR 
===================================================== */

controllers.resubmitPedido = async (req, res) => {
    try {
        if (!isConsultor(req) && !isAdmin(req)) {
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }

        const pedido = await Pedidos.findByPk(req.params.id);

        if (!pedido) {
            return res.status(404).json({
                mensagem: "Pedido não existe"
            });
        }

        // 🔒 Garantir que só pode reenviar se foi devolvido
        const estadosPermitidos = [3, 6]; // devolvido TM ou SL

        if (!estadosPermitidos.includes(pedido.estado_atual)) {
            return res.status(400).json({
                mensagem: "Pedido não pode ser reenviado neste estado"
            });
        }

        // 🔄 Atualizar estado (volta para TM)
        pedido.estado_atual = 1;
        await pedido.save();

        // 📝 Histórico
        await criarHistorico(
            pedido.id_pedido_badge,
            1,
            req.user.id,
            "Pedido reenviado pelo consultor"
        );

        // 🔔 Notificação (podes adaptar para TM/SL se quiseres)
        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido reenviado para nova avaliação."
        );

        return res.status(200).json({
            mensagem: "Pedido reenviado com sucesso"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao reenviar pedido",
            erro: error.message
        });
    }
};



module.exports = controllers;