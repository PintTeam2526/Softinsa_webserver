const Conquistas = require('../models/Conquistas.models');
const Utilizadores = require('../models/Utilizadores.models');
const Consultores = require('../models/Consultores.models');

const conquistasService = require("../services/conquistas.service");

const controllers = {};

//Mostrar todas as conquistas de um consultor
controllers.getConquistaByIdConsultor = async (req, res) => {
    try {
        const isConsultor = req.user?.role === "c";

        if (isConsultor) {
            const resultado = await Consultores.findByPk(req.user.id_consultor);

            if (!resultado) {
                return res.status(404).json({
                    mensagem: "Consultor não existe"
                });
            }

            const conquistasConsultor = await conquistasService.findByIdConsultor(resultado.id_consultor);
            res.json(conquistasConsultor);

        }

        return res.status(403).json({
                mensagem: "Utilizador sem permissões"
            });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar conquistas",
            erro: error.message
        });
    }
};





//MOBILE
controllers.getListaConquistasMobile = async (req, res) => {
    try {
        const conquistas = await Conquistas.findAll();

        const data = conquistas.map(item => ({
            ID_CONQUISTA: item.id_conquista,
            DESCRICAO_CONQUISTA: item.descricao_conquista,
            PONTOS_CONQUISTA: item.pontos_conquista
        }));

        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro ao listar conquistas mobile:", error);
        return res.status(500).json({
            error: "Erro interno ao listar conquistas",
            details: error.message
        });
    }
};

module.exports = controllers;
