const LearningPaths = require('../models/LearningPaths.models');
const ServiceLines = require('../models/ServiceLines.models');
const Areas = require('../models/Areas.models');
const Badges = require('../models/Badges.models');
const Sequelize = require('sequelize');
const firebase = require('../services/firebase.service');
const Op = Sequelize.Op;

const controllers = {};

// Mostrar todas as Learning Paths
controllers.getAllLearningPaths = async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'a';

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
        const isAdmin = req.user?.role === "a";
        const id = req.params.id;

        const resultado = await LearningPaths.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Learning Path não existe"
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
            mensagem: "Erro ao buscar Learning Path",
            erro: error.message
        });
    }
};

// Criar Learning Path
controllers.createLearningPath = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            nome_learning_path,
            descricao_learning_path,
            imagem_learning_path,
            estado_a_i
        } = req.body;

        await LearningPaths.create({
            nome_learning_path,
            descricao_learning_path,
            imagem_learning_path,
            estado_a_i,
            data_insercao: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        });

        firebase.notificarSync('learningPaths'); 

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
        const isAdmin = req.user?.role === "a";

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

        resultado.estado_a_i = false;

        await resultado.save();

        const serviceLines = await ServiceLines.findAll({ where: { id_learning_path: id } });
        const slIds = serviceLines.map(sl => sl.id_service_line);
        await ServiceLines.update({ estado_a_i: false }, { where: { id_learning_path: id } });

        if (slIds.length > 0) {
            const areas = await Areas.findAll({ where: { id_service_line: { [Op.in]: slIds } } });
            const areaIds = areas.map(a => a.id_area);
            await Areas.update({ estado_a_i: false }, { where: { id_service_line: { [Op.in]: slIds } } });

            if (areaIds.length > 0) {
                await Badges.update({ estado_a_i: false }, { where: { id_area: { [Op.in]: areaIds } } });
            }
        }
        firebase.notificarSync('learningPaths'); //tabela que esta na BD local do mobile
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
        const isAdmin = req.user?.role === "a";

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
        learningPath.estado_a_i = estado_a_i ?? learningPath.estado_a_i;

        learningPath.data_insercao = new Date().toISOString().split('T')[0]; // DATA ATUAL

        await learningPath.save();

        if (estado_a_i === false) {
            const serviceLines = await ServiceLines.findAll({ where: { id_learning_path: id } });
            const slIds = serviceLines.map(sl => sl.id_service_line);
            await ServiceLines.update({ estado_a_i: false }, { where: { id_learning_path: id } });

            if (slIds.length > 0) {
                const areas = await Areas.findAll({ where: { id_service_line: { [Op.in]: slIds } } });
                const areaIds = areas.map(a => a.id_area);
                await Areas.update({ estado_a_i: false }, { where: { id_service_line: { [Op.in]: slIds } } });

                if (areaIds.length > 0) {
                    await Badges.update({ estado_a_i: false }, { where: { id_area: { [Op.in]: areaIds } } });
                }
            }
        }
         firebase.notificarSync('learningPaths'); //tabela que esta na BD local do mobile
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

controllers.getAllLearningPathsMobile = async (req, res) => {
  try {
    const resultado = await LearningPaths.findAll();
    //como devolve varios tenho de fazer o map
    const data = resultado.map(item => ({
      ID_LEARNINGPATH: item.id_learning_path,
      NOME_LEARNINGPATH: item.nome_learning_path,
      DESCRICAO_LEARNINGPATH: item.descricao_learning_path,
      IMAGEM_LEARNING_PATH: item.imagem_learning_path,
      ESTADO_A_I_: item.estado_a_i,
      DATA_INSERCAO: item.data_insercao
    }));

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}


controllers.getLearningPathByIdMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(500).send("Tens de enviar o id do LP pelo url!");
  }

  try {
    const resultado = await LearningPaths.findOne({
      where: {id_learning_path: id}
    });

    if (!resultado) {
      return res.status(404).json({ error: "LearningPath não encontrado" });
    }

    const resposta = {
      ID_LEARNINGPATH: resultado.id_learning_path,
      NOME_LEARNINGPATH: resultado.nome_learning_path,
      DESCRICAO_LEARNINGPATH: resultado.descricao_learning_path,
      IMAGEM_LEARNING_PATH: resultado.imagem_learning_path,
      ESTADO_A_I_: resultado.estado_a_i,
      DATA_INSERCAO: resultado.data_insercao
    }

    res.json([resposta]);


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = controllers;
