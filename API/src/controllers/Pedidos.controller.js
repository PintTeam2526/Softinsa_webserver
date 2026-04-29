const Pedidos = require("../models/Pedidos");
const HistoricoPedidos = require("../models/HistoricoPedidos");
const NotificacoesPedidos = require("../models/NotificacoesPedidos");
const BadgesConcluidos = require("../models/BadgesConcluidos");

const controllers = {};

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function isAdmin(req) {
    return req.user?.role === "admin";
}

function isTM(req) {
    return req.user?.role === "talent_manager";
}

function isSL(req) {
    return req.user?.role === "service_line_lider";
}

function isConsultor(req) {
    return req.user?.role === "consultor";
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

/* =====================================================
   GET TODOS PEDIDOS
===================================================== */

controllers.getAllPedidos = async (req, res) => {
    try {
        if (req.user.role === "guest") {
            return res.status(401).json({
                mensagem: "Utilizador não autenticado"
            });
        }

        const pedidos = await Pedidos.findAll();

        return res.status(200).json(pedidos);

    } catch (error) {
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

        const pedido = await Pedidos.create({
            ...req.body,
            estado_atual: 1
        });

        await criarHistorico(
            pedido.id_pedido_badge,
            1,
            req.user.id,
            "Pedido criado"
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido criado com sucesso."
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

controllers.aprovarTM = async (req, res) => {
    try {
        if (!isTM(req) && !isAdmin(req)) {
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

        pedido.estado_atual = 5;
        await pedido.save();

        await criarHistorico(
            pedido.id_pedido_badge,
            5,
            req.user.id,
            "Aprovado pelo Talent Manager"
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido aprovado pelo Talent Manager."
        );

        return res.status(200).json({
            mensagem: "Pedido aprovado"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao aprovar pedido",
            erro: error.message
        });
    }
};

controllers.devolverTM = async (req, res) => {
    try {
        if (!isTM(req) && !isAdmin(req)) {
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

        pedido.estado_atual = 3;
        await pedido.save();

        await criarHistorico(
            pedido.id_pedido_badge,
            3,
            req.user.id,
            "Devolvido pelo Talent Manager"
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido devolvido pelo Talent Manager."
        );

        return res.status(200).json({
            mensagem: "Pedido devolvido"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao devolver pedido",
            erro: error.message
        });
    }
};

/* =====================================================
   SERVICE LINE LIDER
===================================================== */

controllers.aprovarSL = async (req, res) => {
    try {
        if (!isSL(req) && !isAdmin(req)) {
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

        pedido.estado_atual = 8;
        await pedido.save();

        await BadgesConcluidos.create({
            id_badge: pedido.id_badge,
            id_consultor: pedido.id_consultor,
            data_limite_conclusao: new Date(),
            data_conclusao: new Date(),
            url_validacao: "Interno"
        });

        await criarHistorico(
            pedido.id_pedido_badge,
            8,
            req.user.id,
            "Aprovado final"
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido aprovado. Badge atribuído."
        );

        return res.status(200).json({
            mensagem: "Pedido aprovado com sucesso"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao aprovar pedido",
            erro: error.message
        });
    }
};

controllers.devolverSL = async (req, res) => {
    try {
        if (!isSL(req) && !isAdmin(req)) {
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

        pedido.estado_atual = 6;
        await pedido.save();

        await criarHistorico(
            pedido.id_pedido_badge,
            6,
            req.user.id,
            "Devolvido pelo Service Line Líder"
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido devolvido pelo Service Line Líder."
        );

        return res.status(200).json({
            mensagem: "Pedido devolvido"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao devolver pedido",
            erro: error.message
        });
    }
};

controllers.rejeitarSL = async (req, res) => {
    try {
        if (!isSL(req) && !isAdmin(req)) {
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

        pedido.estado_atual = 7;
        await pedido.save();

        await criarHistorico(
            pedido.id_pedido_badge,
            7,
            req.user.id,
            "Pedido rejeitado"
        );

        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido rejeitado."
        );

        return res.status(200).json({
            mensagem: "Pedido rejeitado"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao rejeitar pedido",
            erro: error.message
        });
    }
};

module.exports = controllers;