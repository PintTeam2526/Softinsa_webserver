const sequelize = require('../../database');
const Sequelize = require('sequelize');
const Notificacoes = require('../models/Notificacoes.models');

const controllers = {};

function isAdmin(req) { return req.user?.role === "a"; }
function isTM(req) { return req.user?.role === "t"; }
function isSL(req) { return req.user?.role === "s"; }
function isConsultor(req) { return req.user?.role === "c"; }

const TIPOS_VALIDOS = [1, 2, 3, 4]; // 1-informação, 2-aviso, 3-perigo, 4-correto/válido

controllers.getNotificacoes = async (req, res) => {
    try {
        const role = req.user.role;

        if (!['a', 'c', 't', 's'].includes(role)) {
            return res.status(403).json({ mensagem: "Acesso negado." });
        }

        let where;

        if (isAdmin(req)) {
            // Admin vê tudo, incluindo notificações inativas
            where = {};
        } else if (isConsultor(req)) {
            const id_consultor = req.user.id_consultor;
            if (!id_consultor) {
                return res.status(404).json({ mensagem: "Consultor não encontrado." });
            }
            // Consultor vê as suas pessoais e as globais, mas nunca inativas
            where = {
                estado_a_i: true,
                [Sequelize.Op.or]: [
                    { id_consultor },
                    { id_consultor: null }
                ]
            };
        } else {
            // TM e SLL apenas veem notificações globais e ativas
            where = {
                estado_a_i: true,
                id_consultor: null
            };
        }

        const notificacoes = await Notificacoes.findAll({
            where,
            attributes: ['id_notificacao', 'id_consultor', 'notificacao', 'data_de_envio', 'remetente', 'descricao', 'tipo', 'estado_a_i'],
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
        // Apenas admins podem criar notificações
        if (!isAdmin(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores podem criar notificações." });
        }

        const { notificacao, descricao, remetente, tipo } = req.body;

        if (!notificacao || !remetente) {
            return res.status(400).json({ mensagem: "Notificação e remetente são obrigatórios." });
        }

        if (!tipo || !TIPOS_VALIDOS.includes(Number(tipo))) {
            return res.status(400).json({ mensagem: "Tipo é obrigatório e deve ser 1 (informação), 2 (aviso), 3 (perigo) ou 4 (correto/válido)." });
        }

        // As notificações criadas por este endpoint são sempre globais,
        // por isso ignoramos qualquer id_consultor enviado no body.
        const nova = await Notificacoes.create({
            id_consultor: null,
            notificacao,
            descricao: descricao || null,
            remetente,
            tipo,
            estado_a_i: true,
            data_de_envio: new Date()
        });

        return res.status(201).json({ mensagem: "Notificação criada com sucesso.", dados: nova });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao criar notificação.", erro: error.message });
    }
};

controllers.desativarNotificacao = async (req, res) => {
    try {
        const { id } = req.params;

        const notificacao = await Notificacoes.findByPk(id);

        if (!notificacao) {
            return res.status(404).json({ mensagem: "Notificação não encontrada." });
        }

        if (notificacao.id_consultor === null) {
            // Notificação global: só o admin pode inativar
            if (!isAdmin(req)) {
                return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores podem inativar notificações globais." });
            }
        } else {
            // Notificação pessoal: admin pode sempre, consultor só se for a dele
            if (!isAdmin(req)) {
                if (!isConsultor(req) || notificacao.id_consultor !== req.user.id_consultor) {
                    return res.status(403).json({ mensagem: "Acesso negado. Esta notificação não te pertence." });
                }
            }
        }

        notificacao.estado_a_i = false;
        await notificacao.save();

        return res.status(200).json({ mensagem: "Notificação inativada com sucesso.", dados: notificacao });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao inativar notificação.", erro: error.message });
    }
};

module.exports = controllers;