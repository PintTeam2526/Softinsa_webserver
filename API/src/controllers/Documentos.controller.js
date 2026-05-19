const Documentacoes = require('../models/Documentacoes.models');
const Pedidos = require('../models/PedidosBadges.models');
const Requisitos = require('../models/Requisitos.models');

const controllers = {};

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

async function canAccessDocument(req, doc) {
    if (isAdmin(req)) return true;
    if (isTM(req) && doc.PedidosBadge?.id_talent_manager === req.user.id_talent_manager) return true;
    if (isSL(req) && doc.PedidosBadge?.id_service_line_lider === req.user.id_service_line_lider) return true;
    if (isConsultor(req) && doc.id_consultor === req.user.id_consultor) return true;
    return false;
}

controllers.getAllDocumentos = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const documentos = await Documentacoes.findAll({
            include: [
                { model: Requisitos, attributes: ['id_requisito', 'nome_requisito'] }
            ]
        });

        return res.status(200).json(documentos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.getDocumentoById = async (req, res) => {
    try {
        const { id } = req.params;

        const doc = await Documentacoes.findByPk(id, {
            include: [
                { model: Requisitos, attributes: ['id_requisito', 'nome_requisito'] },
                { model: Pedidos, attributes: ['id_pedido_badge', 'id_consultor', 'id_talent_manager', 'id_service_line_lider'] }
            ]
        });

        if (!doc) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        if (!(await canAccessDocument(req, doc))) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        return res.status(200).json(doc);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.getDocumentosByPedido = async (req, res) => {
    try {
        if (req.user.role === "guest") {
            return res.status(401).json({ error: "Utilizador não autenticado" });
        }

        const { id_pedido } = req.params;

        const pedido = await Pedidos.findByPk(id_pedido);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        const accessMap = {
            c: pedido.id_consultor === req.user.id_consultor,
            t: pedido.id_talent_manager === req.user.id_talent_manager,
            s: pedido.id_service_line_lider === req.user.id_service_line_lider,
            a: true
        };

        if (!accessMap[req.user.role]) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const documentos = await Documentacoes.findAll({
            where: { id_pedido_badge: id_pedido },
            include: [
                { model: Requisitos, attributes: ['id_requisito', 'nome_requisito', 'descricao_requisito'] }
            ]
        });

        return res.status(200).json(documentos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.getDocumentoByRequisito = async (req, res) => {
    try {
        if (req.user.role === "guest") {
            return res.status(401).json({ error: "Utilizador não autenticado" });
        }

        const { id_pedido, id_requisito } = req.params;

        const doc = await Documentacoes.findOne({
            where: {
                id_pedido_badge: id_pedido,
                id_requisito: id_requisito
            },
            include: [
                { model: Requisitos, attributes: ['id_requisito', 'nome_requisito'] },
                { model: Pedidos, attributes: ['id_consultor', 'id_talent_manager', 'id_service_line_lider'] }
            ]
        });

        if (!doc) {
            return res.status(404).json({ error: "Documento não encontrado para este requisito" });
        }

        const pedido = doc.PedidosBadge;
        if (!pedido) {
            return res.status(400).json({ error: "Documento sem pedido associado" });
        }

        const accessMap = {
            c: pedido.id_consultor === req.user.id_consultor,
            t: pedido.id_talent_manager === req.user.id_talent_manager,
            s: pedido.id_service_line_lider === req.user.id_service_line_lider,
            a: true
        };

        if (!accessMap[req.user.role]) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        return res.status(200).json(doc);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.createDocumento = async (req, res) => {
    try {
        if (!isConsultor(req) && !isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const { id_pedido_badge, id_requisito, documentacao } = req.body;

        if (!id_pedido_badge || !id_requisito || !documentacao) {
            return res.status(400).json({ error: "id_pedido_badge, id_requisito e documentacao são obrigatórios" });
        }

        const pedido = await Pedidos.findByPk(id_pedido_badge);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        if (isConsultor(req) && pedido.id_consultor !== req.user.id_consultor) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const docExistente = await Documentacoes.findOne({
            where: {
                id_pedido_badge,
                id_requisito
            }
        });

        if (docExistente) {
            return res.status(400).json({ error: "Já existe um documento para este requisito neste pedido" });
        }

        const doc = await Documentacoes.create({
            id_pedido_badge,
            id_consultor: pedido.id_consultor,
            id_requisito,
            documentacao,
            validado: null
        });

        return res.status(201).json({
            mensagem: "Documento criado com sucesso",
            dados: doc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.updateDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const { documentacao } = req.body;

        const doc = await Documentacoes.findByPk(id, {
            include: [{ model: Pedidos }]
        });

        if (!doc) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        if (isConsultor(req) && doc.PedidosBadge?.id_consultor !== req.user.id_consultor) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        if (doc.validado === true) {
            return res.status(400).json({ error: "Não é possível editar um documento já validado" });
        }

        if (!documentacao) {
            return res.status(400).json({ error: "documentacao é obrigatório" });
        }

        doc.documentacao = documentacao;
        doc.validado = null;
        await doc.save();

        return res.status(200).json({
            mensagem: "Documento atualizado com sucesso",
            dados: doc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.deleteDocumento = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const { id } = req.params;

        const doc = await Documentacoes.findByPk(id);

        if (!doc) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        await doc.destroy();

        return res.status(200).json({ mensagem: "Documento eliminado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.validateDocumento = async (req, res) => {
    try {
        if (!isTM(req) && !isSL(req) && !isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const { id } = req.params;
        const { validado, observacao } = req.body;

        if (validado === undefined || validado === null) {
            return res.status(400).json({ error: "validado é obrigatório (true/false)" });
        }

        const doc = await Documentacoes.findByPk(id, {
            include: [
                {
                    model: Pedidos,
                    attributes: ['id_pedido_badge', 'id_talent_manager', 'id_service_line_lider']
                }
            ]
        });

        if (!doc) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        const pedido = doc.PedidosBadge;
        if (!pedido) {
            return res.status(400).json({ error: "Documento sem pedido associado" });
        }

        if (isTM(req) && pedido.id_talent_manager !== req.user.id_talent_manager) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        if (isSL(req) && pedido.id_service_line_lider !== req.user.id_service_line_lider) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        doc.validado = validado;
        doc.id_utilizador_validador = req.user.id;
        doc.data_validacao = new Date();
        doc.observacao_validacao = observacao || null;

        await doc.save();

        return res.status(200).json({
            mensagem: validado ? "Documento validado com sucesso" : "Documento marcado como inválido",
            dados: doc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

module.exports = controllers;
