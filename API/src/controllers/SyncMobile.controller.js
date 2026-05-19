const ServiceLines = require('../models/ServiceLines.models');
const LearningPaths = require('../models/LearningPaths.models');
const Areas = require('../models/Areas.models');
const Badges = require('../models/Badges.models');
const Estados = require('../models/Estados.models');
const Sequelize = require('sequelize');

const controllers = {};

controllers.syncServiceLinesMobile = async (req, res) => {
  try {
    const serviceLines = await ServiceLines.findAll({
      include: [
        {
          model: LearningPaths,
          attributes: ['id_learning_path', 'nome_learning_path']
        }
      ]
    });

    const data = serviceLines.map(item => ({
      ID_SERVICELINE: item.id_service_line,
      ID_LEARNINGPATH: item.LearningPath?.id_learning_path,
      NOME_SERVICELINE: item.nome_service_line,
      DESCRICAO_SERVICELINE: item.descricao_service_line,
      IMAGEM_SERVICE_LINE: item.imagem_service_line,
      ESTADO_A_I_: item.estado_a_i,
      DATA_INSERCAO: item.data_insercao,
      NOME_LP_PAI: item.LearningPath?.nome_learning_path || ''
    }));

    return res.status(200).json(data);
  } catch (error) {
  console.error("Erro no sync de Service Lines:", error);
  return res.status(500).json({ 
    error: "Erro interno ao sincronizar Service Lines",
    details: error.message 
  });
  }
  }

  controllers.syncAreasMobile = async (req, res) => {
  try {
  const areas = await Areas.findAll({
    include: [
      {
        model: ServiceLines,
        attributes: ['nome_service_line']
      }
    ]
  });

  const data = areas.map(item => ({
    id_area: item.id_area,
    id_service_line: item.id_service_line,
    nome_area: item.nome_area,
    descricao_area: item.descricao_area,
    imagem_area: item.imagem_area,
    estado_a_i: item.estado_a_i,
    data_insercao: item.data_insercao,
    ServiceLine: {
      nomeServiceLine: item.ServiceLine?.nome_service_line || ''
    }
  }));

  return res.status(200).json(data);
  } catch (error) {
  console.error("Erro no sync de Áreas:", error);
  return res.status(500).json({ 
    error: "Erro interno ao sincronizar Áreas",
    details: error.message 
  });
  }
}

controllers.syncLearningPathsMobile = async (req, res) => {
  try {
    const learningPaths = await LearningPaths.findAll();

    const data = learningPaths.map(item => ({
      ID_LEARNINGPATH: item.id_learning_path,
      NOME_LEARNINGPATH: item.nome_learning_path,
      DESCRICAO_LEARNINGPATH: item.descricao_learning_path,
      IMAGEM_LEARNING_PATH: item.imagem_learning_path,
      ESTADO_A_I_: item.estado_a_i,
      DATA_INSERCAO: item.data_insercao
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Learning Paths:", error);
    return res.status(500).json({ 
      error: "Erro interno ao sincronizar Learning Paths",
      details: error.message 
    });
  }
}

controllers.syncBadgesMobile = async (req, res) => {
  try {
    const badges = await Badges.findAll({
      include: [
        {
          model: Areas,
          attributes: ['nome_area']
        }
      ]
    });

    const data = badges.map(item => ({
      ID_BADGE: item.id_badge,
      ID_AREA: item.id_area,
      NOME_BADGE: item.nome_badge,
      DESCRICAO_BADGE: item.descricao_badge,
      PONTOS_BADGE: item.pontos_badge,
      PAGO: item.pago,
      NIVEL_BADGE: item.nivel_badge,
      IMAGEM_BADGE: item.imagem_badge,
      nome_area_pai: item.Area?.nome_area || '',
      DATA_INSERCAO: item.data_insercao,
      ESTADO_A_I_: item.estado_a_i
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Badges:", error);
    return res.status(500).json({ 
      error: "Erro interno ao sincronizar Badges",
      details: error.message 
    });
  }
}

controllers.syncEstadosMobile = async (req, res) => {
  try {
    const estados = await Estados.findAll();

    const data = estados.map(item => ({
      ID_ESTADO: item.id_estado,
      NOME_ESTADO: item.nome_estado,
      DESCRICAO_ESTADO: item.descricao_estado
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Estados:", error);
    return res.status(500).json({ 
      error: "Erro interno ao sincronizar Estados",
      details: error.message 
    });
  }
}

module.exports = controllers;