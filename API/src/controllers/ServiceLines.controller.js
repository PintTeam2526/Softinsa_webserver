const ServiceLines = require('../models/ServiceLines.models');
const LearningPaths = require('../models/LearningPaths.models');
const Areas = require('../models/Areas.models');
const Badges = require('../models/Badges.models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

        if (!id_learning_path) {
            return res.status(400).json({
                mensagem: "O id_learning_path é obrigatório"
            });
        }

        if (estado_a_i !== false) {
            const lp = await LearningPaths.findByPk(id_learning_path);
            if (!lp) {
                return res.status(400).json({
                    mensagem: "A Learning Path especificada não existe"
                });
            }
            if (lp.estado_a_i === false) {
                return res.status(400).json({
                    mensagem: "Não é possível criar uma Service Line ativa numa Learning Path inativa"
                });
            }
        }

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

        const areas = await Areas.findAll({ where: { id_service_line: id } });
        const areaIds = areas.map(a => a.id_area);
        await Areas.update({ estado_a_i: false }, { where: { id_service_line: id } });

        if (areaIds.length > 0) {
            await Badges.update({ estado_a_i: false }, { where: { id_area: { [Op.in]: areaIds } } });
        }

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

        if (id_learning_path !== undefined && id_learning_path !== serviceLine.id_learning_path) {
            const lp = await LearningPaths.findByPk(id_learning_path);
            if (!lp) {
                return res.status(400).json({
                    mensagem: "A Learning Path especificada não existe"
                });
            }
            if (lp.estado_a_i === false) {
                return res.status(400).json({
                    mensagem: "Não é possível associar a uma Learning Path inativa"
                });
            }
        }

        serviceLine.id_learning_path = id_learning_path ?? serviceLine.id_learning_path;
        serviceLine.nome_service_line = nome_service_line ?? serviceLine.nome_service_line;
        serviceLine.descricao_service_line = descricao_service_line ?? serviceLine.descricao_service_line;
        serviceLine.imagem_service_line = imagem_service_line ?? serviceLine.imagem_service_line;
        serviceLine.estado_a_i = estado_a_i ?? serviceLine.estado_a_i;

        serviceLine.data_insercao = new Date().toISOString().split('T')[0]; // DATA ATUAL

        await serviceLine.save();

        if (estado_a_i === false) {
            const areas = await Areas.findAll({ where: { id_service_line: id } });
            const areaIds = areas.map(a => a.id_area);
            await Areas.update({ estado_a_i: false }, { where: { id_service_line: id } });

            if (areaIds.length > 0) {
                await Badges.update({ estado_a_i: false }, { where: { id_area: { [Op.in]: areaIds } } });
            }
        }

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


controllers.getAllServiceLinesMobile = async (req, res) => {
  try { 
    const resultado = await ServiceLines.findAll({
      include: [
        {
          model: LearningPaths,
          attributes: [
            'id_learning_path',
            'nome_learning_path'
          ]
        }
      ]
    });
    console.log(JSON.stringify(resultado, null, 2));
    
    const resposta = resultado.map(item => ({
      ID_SERVICELINE: item.id_service_line,
      ID_LEARNINGPATH: item.LearningPath.id_learning_path,
      NOME_SERVICELINE: item.nome_service_line,
      DESCRICAO_SERVICELINE: item.descricao_service_line,
      IMAGEM_SERVICE_LINE: item.imagem_service_line,
      ESTADO_A_I_: item.estado_a_i,
      NOME_LP_PAI: item.LearningPath.nome_learning_path,
      DATA_INSERCAO: item.data_insercao
    }));

    res.json(resposta);

  } catch (error) {
    return res.status(500).json({
        mensagem: "Erro ao ir buscar todas as SL",
        erro: error.message
    });
  }
}

controllers.getServiceLineByIdMobile = async (req, res) => {
  const { id } = req.params;
  if (!id)
  {
    return res.status(500).send("Tens de enviar o id da Service Line pelo url");
  }

  try { 
    const response = await ServiceLines.findOne({
      where: { id_service_line: id },
      include: [
        {
          model: LearningPaths,
          attributes: [
            'id_learning_path',
            'nome_learning_path'
          ]
        }
      ]
    });

    const result = {
      ID_SERVICELINE: response.id_service_line,
      ID_LEARNINGPATH: response.LearningPath.id_learning_path,
      NOME_SERVICELINE: response.nome_service_line,
      DESCRICAO_SERVICELINE: response.descricao_service_line,
      IMAGEM_SERVICE_LINE: response.imagem_service_line,
      ESTADO_A_I_: response.estado_a_i,
      NOME_LP_PAI: response.LearningPath.nome_learning_path,
      DATA_INSERCAO: response.data_insercao
    }
    
    return res.json([result]);
    
  } catch {
    return res.status(500).json({
        mensagem: "Erro ao ir buscar a SL",
        erro: error.message
    });
  }
}



module.exports = controllers;