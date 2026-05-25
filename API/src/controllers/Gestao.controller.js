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

module.exports = controllers;