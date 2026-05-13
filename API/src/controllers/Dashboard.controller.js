const { Op } = require("sequelize");

const objetivos = require('../models/Objetivos.models');
const badgesObtidos = require('../models/BadgesConcluidos.models');
const badges = require('../models/Badges.models');
const utilizador = require('../models/Utilizadores.models');
const consultor = require('../models/Consultores.models');
const area = require('../models/Areas.models')
const listarPedidos = require('../services/listarPedidos.service')

const controller = {};

/*controller.mobile = async (req, res) => {

    try {

        const isConsultor = req.user?.role === "CO";

        if (!isConsultor) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        // DADOS DO CONSULTOR
        const consultorData = await utilizador.findOne({
            where: {
                id_utilizador: req.user.id
            },
            include: [{
                model: consultor,
                include: [{
                    model: area
                }]
            }]
        });
        // OBJETIVOS CONCLUÍDOS
        const objetivosResultado = await objetivos.findAll({
            where: {
                id_consultor: req.user.id,
                data_conclusao_objetivo: {
                    [Op.ne]: null
                }
            }
        });

        const objetivosNum = objetivosResultado.length;

        // BADGES OBTIDOS
        const badgesObtidosResultado = await badgesObtidos.findAll({
            where: {
                id_consultor: req.user.id
            }
        });

        const badgesObtidosNum = badgesObtidosResultado.length;

        // IDS DOS BADGES OBTIDOS
        const idsBadgesObtidos = badgesObtidosResultado.map(
            badge => badge.id_badge
        );

        // BADGES POR OBTER
        const badgesPorObter = await badges.findAll({
            where: {
                estado_a_i: true,
                id_badge: {
                    [Op.notIn]: idsBadgesObtidos
                }
            }
        });

        const badgesPorObterNum = badgesPorObter.length;

        return res.status(200).json({
            consultorData
            utilizador: consultorData.nome_utilizador,
            area: consultorData.consultor.area.nome_area,
            objetivosConcluidos: objetivosNum,
            badgesObtidos: badgesObtidosNum,
            badgesPorObter: badgesPorObterNum
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar utilizadores",
            erro: error.message
        });
    }
};*/

controller.consultor = async (req, res) => {
    try{
        const isConsultor = req.user?.role === "CO";

        const badgesObtidosConsultor = await badgesObtidos.findAll({
            where: id_consultor = req.user.id_consultor
        })

        const pedidos = listarPedidos('')

        res.json({badgesObtidosConsultor})
    }
    catch(error)
    {
        res.status(500).json({mensagem: "Erro de servidor"})
    }
}

module.exports = controller;