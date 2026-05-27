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

//MOBILE
controllers.getListaConquistasByIdConsultorMobile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ mensagem: "ID do consultor é obrigatório no header" });
        }

        const resultadoService = await conquistasService.findByIdConsultor(id);

        // Mapear para o formato exato que o ConquistasModel do Flutter espera
        const listaFormatada = resultadoService.conquistas.map(c => ({
            id_conquista: c.id_conquista,
            descricao_conquista: c.descricao_conquista,
            pontos_conquista: c.pontos_conquista,
            tipo_conquista: c.tipo_conquista,
            valor_conquista: c.valor_conquista,
            estado_conquista: c.estado // No service chama-se 'estado', no Flutter 'estado_conquista'
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


//IMPLEMENTAR COUNT(*) numeroConquistasUtilizadorMobile

module.exports = controllers;
