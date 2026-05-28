const sequelize = require('../../database');
const Sequelize = require('sequelize');
const Notificacoes = require('../models/Notificacoes.models');

const controllers = {};

function isAdmin(req) { return req.user?.role === "a"; }
function isTM(req) { return req.user?.role === "t"; }
function isSL(req) { return req.user?.role === "s"; }

controllers.getNotificacoes = async (req, res) => {
    try {
        const role = req.user.role;

        if (!['c', 't', 's'].includes(role)) {
            return res.status(403).json({ mensagem: "Acesso negado." });
        }

        let where;

        if (role === 'c') {
            const id_consultor = req.user.id_consultor;
            if (!id_consultor) {
                return res.status(404).json({ mensagem: "Consultor não encontrado." });
            }
            where = {
                [Sequelize.Op.or]: [
                    { id_consultor },
                    { id_consultor: null }
                ]
            };
        } else {
            // TM e SLL apenas veem notificações globais
            where = { id_consultor: null };
        }

        const notificacoes = await Notificacoes.findAll({
            where,
            attributes: ['notificacao', 'data_de_envio', 'remetente', 'descricao'],
            order: [['data_de_envio', 'DESC']]
        });

        return res.status(200).json(notificacoes);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter notificações.", erro: error.message });
    }
};

controllers.criarNotificacao = async (req, res) => {
    try {
        if (!isAdmin(req) && !isTM(req) && !isSL(req)) {
            return res.status(403).json({ mensagem: "Acesso negado." });
        }

        const { id_consultor, notificacao, descricao, remetente } = req.body;

        if (!notificacao || !remetente) {
            return res.status(400).json({ mensagem: "Notificação e remetente são obrigatórios." });
        }

        const nova = await Notificacoes.create({
            id_consultor: id_consultor || null,
            notificacao,
            descricao: descricao || null,
            remetente,
            data_de_envio: new Date()
        });

        return res.status(201).json({ mensagem: "Notificação criada com sucesso.", dados: nova });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao criar notificação.", erro: error.message });
    }
};

module.exports = controllers;