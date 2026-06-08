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
            const resultado = await Consultores.findByPk(req.user.id_consultor)

            if (!resultado) {
                return res.status(404).json({ mensagem: "Consultor não existe" })
            }

            const conquistasConsultor = await conquistasService.findByIdConsultor(resultado.id_consultor)
            return res.json(conquistasConsultor)
        }

        return res.status(403).json({ mensagem: "Utilizador sem permissões" })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar conquistas",
            erro: error.message
        });
    }
};


module.exports = controllers;