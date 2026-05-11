const Badges = require('../models/Badges.models');

const controllers = {};

// Mostrar todos os badges
controllers.getAllBadges = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        const whereClause = isAdmin ? {} : { estado_a_i: true };

        const resultado = await Badges.findAll({
            where: whereClause
        });

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar badges",
            erro: error.message
        });
    }
};

// Mostrar badge por ID
controllers.getBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";
        const id = req.params.id;

        const resultado = await Badges.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        if (resultado.estado_a_i === false && !isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar badge",
            erro: error.message
        });
    }
};

// Criar badge
controllers.createBadge = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_badge,
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i
        } = req.body;

        await Badges.create({
            id_badge,
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i,
            data_insercao: new Date() // DATA ATUAL
        });

        return res.status(201).json({
            mensagem: "Badge criado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao criar badge",
            erro: error.message
        });
    }
};

// Eliminar badge
controllers.deleteBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const resultado = await Badges.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        resultado.estado_a_i = false;

        await resultado.save();

        return res.status(200).json({
            mensagem: "Badge eliminado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar badge",
            erro: error.message
        });
    }
};

// Atualizar badge
controllers.updateBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const badge = await Badges.findByPk(id);

        if (!badge) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        const {
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i
        } = req.body;

        badge.id_area = id_area ?? badge.id_area;
        badge.nome_badge = nome_badge ?? badge.nome_badge;
        badge.descricao_badge = descricao_badge ?? badge.descricao_badge;
        badge.pontos_badge = pontos_badge ?? badge.pontos_badge;
        badge.pago = pago ?? badge.pago;
        badge.nivel_badge = nivel_badge ?? badge.nivel_badge;
        badge.imagem_badge = imagem_badge ?? badge.imagem_badge;
        badge.sla = sla ?? badge.sla;
        badge.validade = validade ?? badge.validade;
        badge.estado_a_i = estado_a_i ?? badge.estado_a_i;

        badge.data_insercao = new Date(); // DATA ATUALIZADA

        await badge.save();

        return res.status(200).json({
            mensagem: "Badge atualizado com sucesso",
            dados: badge
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar badge",
            erro: error.message
        });
    }
};

module.exports = controllers;