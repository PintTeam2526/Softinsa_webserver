const Conquistas = require('../models/Conquistas.models');
const Utilizadores = require('../models/Utilizadores.models');
const Consultores = require('../models/Consultores.models');
const ConquistasConsultores = require('../models/ConquistasConsultores.models');

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


controllers.getListaConquistasByIdConsultorMobile = async (req, res) => {
    try {
        const { idConsultor } = req.params;

        if (!idConsultor) {
            return res.status(400).json({ mensagem: "ID do consultor é obrigatório no body" });
        }

        const resultadoService = await conquistasService.findByIdConsultor(idConsultor);

        // Mapear para o formato exato que o ConquistasModel do Flutter espera
        const listaFormatada = resultadoService.conquistas.map(c => ({
            id_conquista: c.id_conquista,
            descricao_conquista: c.descricao_conquista,
            pontos_conquista: c.pontos_conquista,
            tipo_conquista: c.tipo_conquista,
            valor_conquista: c.valor_conquista,
            estado_conquista: c.estado
        }));

        return res.json(listaFormatada);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao buscar conquistas para mobile",
            erro: error.message
        });
    }
};

// MOBILE - Retorna apenas o número total de conquistas obtidas
controllers.getCountConquistasObtidasMobile = async (req, res) => {
    try {
        const { idConsultor } = req.params;

        if (!idConsultor) {
            return res.status(400).json({ mensagem: "ID do consultor é obrigatório no body" });
        }

        const count = await ConquistasConsultores.count({
            where: { id_consultor: idConsultor }
        });

        return res.json({ total_conquistas_obtidas: count });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao contar conquistas",
            erro: error.message
        });
    }
};

module.exports = controllers;
