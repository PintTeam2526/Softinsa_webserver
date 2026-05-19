const Requisitos = require('../models/Requisitos.models');
const Badges = require('../models/Badges.models');

const controllers = {};

function isAdmin(req) {
    return req.user?.role === "a";
}

controllers.getAllRequisitos = async (req, res) => {
    try {
        const whereClause = isAdmin(req) ? {} : { estado_a_i: true };

        const response = await Requisitos.findAll({ where: whereClause });

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.getRequisitoById = async (req, res) => {
    try {
        const { id } = req.params;

        const requisito = await Requisitos.findByPk(id);

        if (!requisito) {
            return res.status(404).json({ error: "Requisito não encontrado" });
        }

        if (!requisito.estado_a_i && !isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        return res.status(200).json(requisito);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.getRequisitosBadgeMobile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Tens de enviar o id do badge por parametro" });
        }

        const response = await Requisitos.findAll({
            where: { id_badge: id }
        });

        const dados = response.map(item => ({
            ID_REQUISITO: item.id_requisito,
            ID_BADGE: item.id_badge,
            NOME_REQUISITO: item.nome_requisito,
            DESCRICAO_REQUISITO: item.descricao_requisito,
            IMAGEM_REQUISITO: item.imagem_requisito,
            ESTADO_A_I_: item.estado_a_i
        }));

        res.json(dados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.getRequisitosBadge = async (req, res) => {
    try {
        const { id_badge } = req.params;
        if (!id_badge) {
            return res.status(400).json({ error: "Tens de enviar o id do badge por parametro" });
        }

        const response = await Requisitos.findAll({
            where: { id_badge: id_badge }
        });

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.createRequisito = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const { id_badge, nome_requisito, descricao_requisito, imagem_requisito } = req.body;

        if (!id_badge || !nome_requisito) {
            return res.status(400).json({ error: "id_badge e nome_requisito são obrigatórios" });
        }

        const badge = await Badges.findByPk(id_badge);
        if (!badge) {
            return res.status(404).json({ error: "Badge não encontrado" });
        }

        if (!badge.estado_a_i) {
            return res.status(400).json({ error: "Não é possível adicionar requisitos a um badge inativo" });
        }

        const countAtivos = await Requisitos.count({
            where: { id_badge, estado_a_i: true }
        });

        if (countAtivos >= 5) {
            return res.status(400).json({ error: "O badge já tem o máximo de 5 requisitos ativos" });
        }

        const requisito = await Requisitos.create({
            id_badge,
            nome_requisito,
            descricao_requisito: descricao_requisito || null,
            imagem_requisito: imagem_requisito || null,
            data_insercao: new Date(),
            estado_a_i: true
        });

        return res.status(201).json({
            mensagem: "Requisito criado com sucesso",
            dados: requisito
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.updateRequisito = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const { id } = req.params;
        const { nome_requisito, descricao_requisito, imagem_requisito, estado_a_i } = req.body;

        const requisito = await Requisitos.findByPk(id);

        if (!requisito) {
            return res.status(404).json({ error: "Requisito não encontrado" });
        }

        requisito.nome_requisito = nome_requisito ?? requisito.nome_requisito;
        requisito.descricao_requisito = descricao_requisito ?? requisito.descricao_requisito;
        requisito.imagem_requisito = imagem_requisito ?? requisito.imagem_requisito;
        requisito.estado_a_i = estado_a_i ?? requisito.estado_a_i;
        requisito.data_insercao = new Date();

        await requisito.save();

        return res.status(200).json({
            mensagem: "Requisito atualizado com sucesso",
            dados: requisito
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

controllers.deleteRequisito = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(401).json({ error: "Utilizador não autorizado" });
        }

        const { id } = req.params;

        const requisito = await Requisitos.findByPk(id);

        if (!requisito) {
            return res.status(404).json({ error: "Requisito não encontrado" });
        }

        requisito.estado_a_i = false;
        await requisito.save();

        return res.status(200).json({ mensagem: "Requisito eliminado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

module.exports = controllers;
