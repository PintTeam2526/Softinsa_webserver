const ServiceLines = require('../models/ServiceLines.models');

const controllers = {};

// Mostrar todas as Service Lines
controllers.getAllServiceLines = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        const whereClause = isAdmin ? {} : { estado_a_i: true };

        const resultado = await ServiceLines.findAll({
            where: whereClause
        });

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar Service Lines",
            erro: error.message
        });
    }
};

// Mostrar Service Line por ID
controllers.getServiceLineById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";
        const id = req.params.id;

        const resultado = await ServiceLines.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Service Line não existe"
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
            mensagem: "Erro ao buscar Service Line",
            erro: error.message
        });
    }
};

// Criar Service Line
controllers.createServiceLine = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_learning_path,
            nome_service_line,
            descricao_service_line,
            imagem_service_line,
            estado_a_i
        } = req.body;

        await ServiceLines.create({
            id_learning_path,
            nome_service_line,
            descricao_service_line,
            imagem_service_line,
            estado_a_i,
            data_insercao: new Date().toISOString().split('T')[0] // DATA ATUAL
        });

        return res.status(201).json({
            mensagem: "Service Line criada com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao criar Service Line",
            erro: error.message
        });
    }
};

// Eliminar Service Line (soft delete)
controllers.deleteServiceLineById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const resultado = await ServiceLines.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Service Line não existe"
            });
        }

        resultado.estado_a_i = false;

        await resultado.save();

        return res.status(200).json({
            mensagem: "Service Line eliminada com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar Service Line",
            erro: error.message
        });
    }
};

// Atualizar Service Line
controllers.updateServiceLineById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const serviceLine = await ServiceLines.findByPk(id);

        if (!serviceLine) {
            return res.status(404).json({
                mensagem: "Service Line não existe"
            });
        }

        const {
            id_learning_path,
            nome_service_line,
            descricao_service_line,
            imagem_service_line,
            estado_a_i
        } = req.body;

        serviceLine.id_learning_path = id_learning_path ?? serviceLine.id_learning_path;
        serviceLine.nome_service_line = nome_service_line ?? serviceLine.nome_service_line;
        serviceLine.descricao_service_line = descricao_service_line ?? serviceLine.descricao_service_line;
        serviceLine.imagem_service_line = imagem_service_line ?? serviceLine.imagem_service_line;
        serviceLine.estado_a_i = estado_a_i ?? serviceLine.estado_a_i;

        serviceLine.data_insercao = new Date().toISOString().split('T')[0]; // DATA ATUAL

        await serviceLine.save();

        return res.status(200).json({
            mensagem: "Service Line atualizada com sucesso",
            dados: serviceLine
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar Service Line",
            erro: error.message
        });
    }
};

module.exports = controllers;