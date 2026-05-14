const ServiceLines = require('../models/ServiceLines.models');
const LearningPaths = require('../models/LearningPaths.models');
const controllers = {};

// Mostrar todas as Service Lines
controllers.getAllServiceLines = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "A";

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
        const isAdmin = req.user?.role === "A";
        const id = req.params.id;

        const resultado = await ServiceLines.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Service Line não existe"
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
            mensagem: "Erro ao buscar Service Line",
            erro: error.message
        });
    }
};

// Criar Service Line
controllers.createServiceLine = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "A";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_service_line,
            id_learning_path,
            nome_serviceline,
            descricao_serviceline,
            imagem_serviceline,
            estado_a_i
        } = req.body;

        await ServiceLines.create({
            id_service_line,
            id_learning_path,
            nome_serviceline,
            descricao_serviceline,
            imagem_serviceline,
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
        const isAdmin = req.user?.role === "admin";

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
        const isAdmin = req.user?.role === "admin";

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
            nome_serviceline,
            descricao_serviceline,
            imagem_serviceline,
            estado_A_I_
        } = req.body;

        serviceLine.id_learning_path = id_learning_path ?? serviceLine.id_learning_path;
        serviceLine.nome_serviceline = nome_serviceline ?? serviceLine.nome_serviceline;
        serviceLine.descricao_serviceline = descricao_serviceline ?? serviceLine.descricao_serviceline;
        serviceLine.imagem_serviceline = imagem_serviceline ?? serviceLine.imagem_serviceline;
        serviceLine.estado_a_i = estado_A_I_ ?? serviceLine.estado_A_I_;

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