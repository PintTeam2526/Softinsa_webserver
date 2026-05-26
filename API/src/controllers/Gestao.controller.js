const Sequelize = require("sequelize");
const sequelize = require("../../database");
const Areas = require('../models/Areas.models')
const ServiceLineLiders = require('../models/ServiceLineLiders.models')
const Consultores = require('../models/Consultores.models')
const Utilizadores = require('../models/Utilizadores.models')
const BadgesConcluidos = require('../models/BadgesConcluidos.models')
const Badges = require('../models/Badges.models')

const controllers = {};

function isTM(req) {
    return req.user?.role === "t";
}

function isSL(req) {
    return req.user?.role === "s";
}

controllers.badgesConsultores = async (req, res) => {
    try {
        if (!isTM(req) && !isSL(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas Talent Managers e Service Line Líderes podem aceder a este recurso." });
        }

        let whereConsultor = {};

        // Se for SLL, filtrar apenas consultores da sua service line
        if (isSL(req)) {
            const sll = await ServiceLineLiders.findOne({
                where: { id_service_line_lider: req.user.id_service_line_lider }
            });

            if (!sll) {
                return res.status(404).json({ mensagem: "Service Line Líder não encontrado." });
            }

            // Buscar áreas que pertencem à service line do SLL
            const areas = await Areas.findAll({
                where: { id_service_line: sll.id_service_line },
                attributes: ['id_area']
            });

            const idsAreas = areas.map(a => a.id_area);

            whereConsultor = {
                id_area: { [Sequelize.Op.in]: idsAreas }
            };
        }

        const consultores = await Consultores.findAll({
            where: whereConsultor,
            include: [
                {
                    model: Utilizadores,
                    attributes: ['nome_utilizador']
                },
                {
                    model: BadgesConcluidos,
                    include: [
                        {
                            model: Badges,
                            attributes: ['nome_badge']
                        }
                    ]
                }
            ]
        });

        const resultado = consultores.map(consultor => ({
            nome: consultor.Utilizadore.nome_utilizador,
            badges: consultor.BadgesConcluidos.map(bc => bc.Badge.nome_badge)
        }));

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter badges dos consultores.", erro: error.message });
    }
};

controllers.rankConsultores = async (req, res) => {
    try {
        if (!isTM(req) && !isSL(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas Talent Managers e Service Line Líderes podem aceder a este recurso." });
        }

        let whereConsultor = {};

        if (isSL(req)) {
            const sll = await ServiceLineLiders.findOne({
                where: { id_service_line_lider: req.user.id_service_line_lider }
            });

            if (!sll) {
                return res.status(404).json({ mensagem: "Service Line Líder não encontrado." });
            }

            const areas = await Areas.findAll({
                where: { id_service_line: sll.id_service_line },
                attributes: ['id_area']
            });

            const idsAreas = areas.map(a => a.id_area);

            whereConsultor = {
                id_area: { [Sequelize.Op.in]: idsAreas }
            };
        }

        const consultores = await Consultores.findAll({
            where: whereConsultor,
            include: [
                {
                    model: Utilizadores,
                    attributes: ['nome_utilizador']
                },
                {
                    model: Areas,
                    attributes: ['nome_area']
                },
                {
                    model: BadgesConcluidos,
                    include: [
                        {
                            model: Badges,
                            attributes: ['id_badge', 'nome_badge', 'id_area']
                        }
                    ]
                }
            ]
        });

        // Para cada consultor, calcular o total de badges da sua área
        const resultado = await Promise.all(consultores.map(async (consultor) => {
            const idArea = consultor.id_area;

            // Total de badges existentes na área do consultor
            const totalBadgesArea = await Badges.count({
                where: { id_area: idArea, estado_a_i: true }
            });

            // Badges concluídos da área do consultor
            const badgesDaArea = consultor.BadgesConcluidos.filter(
                bc => bc.Badge?.id_area === idArea
            );

            const progressoNumerico = totalBadgesArea > 0
                ? Math.round((badgesDaArea.length / totalBadgesArea) * 100)
                : 0;

            return {
                nome: consultor.Utilizadore?.nome_utilizador || "Sem nome",
                area: consultor.Area?.nome_area || "Sem área",
                total_pontos: consultor.total_pontos || 0,
                badges_obtidos: consultor.BadgesConcluidos.length,
                progresso_area: progressoNumerico  // devolve número, ex: 75
            };
        }));

        resultado.sort((a, b) => b.progresso_area - a.progresso_area);

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter ranking de consultores.", erro: error.message });
    }
};

module.exports = controllers;