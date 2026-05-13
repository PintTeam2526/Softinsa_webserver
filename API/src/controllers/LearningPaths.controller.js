const LearningPaths = require('../models/LearningPaths.models');

const controllers = {};

// Mostrar todas as Learning Paths
controllers.getAllLearningPaths = async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'A';

        const whereClause = isAdmin ? {} : { estado_a_i: true };

        const resultado = await LearningPaths.findAll({
            where: whereClause
        });
        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar Learning Paths",
            erro: error.message
        });
    }
};

// Mostrar uma Learning Path por ID
controllers.getLearningPathById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "A";
        const id = req.params.id;

        const resultado = await LearningPaths.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Learning Path não existe"
            });
        }

        if (resultado.estado_A_I_ === false && !isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar Learning Path",
            erro: error.message
        });
    }
};

// Criar Learning Path
controllers.createLearningPath = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "A";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_learning_path,
            nome_learning_path,
            descricao_learning_path,
            imagem_learning_path,
            estado_a_i
        } = req.body;

        await LearningPaths.create({
            id_learning_path,
            nome_learning_path,
            descricao_learning_path,
            imagem_learning_path,
            estado_a_i,
            data_insercao: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        });

        return res.status(201).json({
            mensagem: "Learning Path criada com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao criar Learning Path",
            erro: error.message
        });
    }
};

// Eliminar Learning Path
controllers.deleteLearningPathById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "A";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const resultado = await LearningPaths.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Learning Path não existe"
            });
        }

        resultado.estado_A_I_ = false;

        await resultado.save();

        return res.status(200).json({
            mensagem: "Learning Path eliminada com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar Learning Path",
            erro: error.message
        });
    }
};

// Atualizar Learning Path
controllers.updateLearningPathById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "A";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const learningPath = await LearningPaths.findByPk(id);

        if (!learningPath) {
            return res.status(404).json({
                mensagem: "Learning Path não existe"
            });
        }

        const {
            nome_learning_path,
            descricao_learning_path,
            imagem_learning_path,
            estado_a_i
        } = req.body;

        learningPath.nome_learning_path = nome_learning_path ?? learningPath.nome_learning_path;
        learningPath.descricao_learning_path = descricao_learning_path ?? learningPath.descricao_learning_path;
        learningPath.imagem_learning_path = imagem_learning_path ?? learningPath.imagem_learning_path;
        learningPath.estado_A_I_ = estado_A_I_ ?? learningPath.estado_A_I_;

        learningPath.data_insercao = new Date().toISOString().split('T')[0]; // DATA ATUAL

        await learningPath.save();

        return res.status(200).json({
            mensagem: "Learning Path atualizada com sucesso",
            dados: learningPath
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar Learning Path",
            erro: error.message
        });
    }
};

module.exports = controllers;
