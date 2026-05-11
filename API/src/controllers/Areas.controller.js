const Areas = require('../models/Areas.models');

const controllers = {};

// Mostrar todas as áreas
controllers.getAllAreas = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        const whereClause = isAdmin ? {} : { estado_a_i: true };

        const resultado = await Areas.findAll({
            where: whereClause
        });

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Não existe áreas"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Erro ao buscar áreas:", error);

        return res.status(500).json({
            mensagem: "Erro na pesquisa",
            erro: error.message
        });
    }
};

// Mostrar área por ID
controllers.getAreaByID = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";
        const id = req.params.id;

        const resultado = await Areas.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Área não existe"
            });
        }

        if (resultado.estado_A_I === false && !isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Erro ao buscar áreas:", error);

        return res.status(500).json({
            mensagem: "Erro na pesquisa",
            erro: error.message
        });
    }
};

// Criar área
controllers.createArea = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_area,
            id_serviceline,
            nome_area,
            descricao_area,
            imagem_area,
            estado_A_I
        } = req.body;

        await Areas.create({
            id_area,
            id_serviceline,
            nome_area,
            descricao_area,
            imagem_area,
            estado_A_I,
            data_insercao: new Date()   // DATA ATUAL
        });

        return res.status(201).json({
            mensagem: "Área criada"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao criar área",
            erro: error.message
        });
    }
};

// Eliminar área
controllers.deleteAreaByID = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;
        const resultado = await Areas.findByPk(id);

        resultado.estado_A_I = false;
        await resultado.save();

        return res.status(200).json({
            message: 'Área eliminada'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar área",
            erro: error.message
        });
    }
};

// Atualizar área
controllers.updateAreaByID = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "admin";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;
        const area = await Areas.findByPk(id);

        if (!area) {
            return res.status(404).json({
                mensagem: "Área não existe"
            });
        }

        const {
            id_serviceline,
            nome_area,
            descricao_area,
            imagem_area,
            estado_A_I
        } = req.body;

        area.id_serviceline = id_serviceline ?? area.id_serviceline;
        area.nome_area = nome_area ?? area.nome_area;
        area.descricao_area = descricao_area ?? area.descricao_area;
        area.imagem_area = imagem_area ?? area.imagem_area;
        area.estado_A_I = estado_A_I ?? area.estado_A_I;

        area.data_insercao = new Date(); // DATA ATUALIZADA

        await area.save();

        return res.status(200).json({
            mensagem: "Área atualizada com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar área",
            erro: error.message
        });
    }
};

module.exports = controllers;