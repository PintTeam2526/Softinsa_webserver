const ServiceLines = require('../models/ServiceLines.models');
const LearningPaths = require('../models/LearningPaths.models');
const Areas = require('../models/Areas.models');
const Badges = require('../models/Badges.models');
const Estados = require('../models/Estados.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const HistoricoPedidos = require('../models/HistoricoPedidos.models');
const Objetivos = require('../models/Objetivos.models');
const Requisitos = require('../models/Requisitos.models');
const Documentacoes = require('../models/Documentacoes.models');


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

controllers.syncBadgesConcluidosMobile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do consultor é obrigatório" });
    }

    const conquistas = await BadgesConcluidos.findAll({
      where: { id_consultor: id },
      include: [
        {
          model: Badges,
          include: [
            {
              model: Areas,
              include: [ServiceLines]
            }
          ]
        }
      ]
    });

    const data = conquistas.map(c => {
      const b = c.Badge;
      const area = b?.Area;
      const sl = area?.ServiceLine;

      return {
        ID_BADGE_CONCLUIDO: c.id_badge_concluido,
        ID_BADGE: b?.id_badge,
        NOME_BADGE: b?.nome_badge || "Sem Nome",
        nome_area_pai: area?.nome_area || "Sem Área",
        NIVEL_BADGE: b?.nivel_badge || "",
        PONTOS_BADGE: b?.pontos_badge || 0,
        IMAGEM_BADGE: b?.imagem_badge || "",
        DATA_CONCLUSAO: c.data_conclusao_badge,
        VALIDADE: b?.validade,
        nome_sl_pai: sl?.nome_service_line || "N/A"
      };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Badges Concluídos:", error);
    return res.status(500).json({
      error: "Erro interno ao sincronizar Badges Concluídos",
      details: error.message
    });
  }
}

controllers.syncPedidosBadgesMobile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do consultor é obrigatório" });
    }

    const pedidos = await PedidosBadges.findAll({
      where: { id_consultor: id }
    });

    const data = pedidos.map(item => ({
      ID_PEDIDO_BADGE: item.id_pedido_badge,
      ID_CONSULTOR: item.id_consultor,
      ID_BADGE: item.id_badge,
      ESTADO_ATUAL: item.estado_atual
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Pedidos de Badges:", error);
    return res.status(500).json({
      error: "Erro interno ao sincronizar Pedidos de Badges",
      details: error.message
    });
  }
}

controllers.syncHistoricoPedidosMobile = async (req, res) => {
  try {
    const { id } = req.params; // id_consultor

    if (!id) {
      return res.status(400).json({ error: "ID do consultor é obrigatório" });
    }

    const historico = await HistoricoPedidos.findAll({
      include: [
        {
          model: PedidosBadges,
          where: { id_consultor: id },
          attributes: ['id_badge', 'id_consultor']
        }
      ]
    });

    const data = historico.map(item => ({
      ID_HISTORICO: item.id_historico,
      ID_BADGE: item.PedidosBadge?.id_badge,
      ID_CONSULTOR: item.PedidosBadge?.id_consultor,
      DATA: item.data
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Histórico de Pedidos:", error);
    return res.status(500).json({
      error: "Erro interno ao sincronizar Histórico de Pedidos",
      details: error.message
    });
  }
}

controllers.syncObjetivosMobile = async (req, res) => {
  try {
    const { id } = req.params; // id_consultor

    if (!id) {
      return res.status(400).json({ error: "ID do consultor é obrigatório" });
    }

    const objetivos = await Objetivos.findAll({
      where: { id_consultor: id }
    });

    const data = objetivos.map(item => ({
      ID_OBJETIVO: item.id_objetivo,
      ID_BADGE: item.id_badge,
      ID_CONSULTOR: item.id_consultor,
      DATA_LIMITE_CONCLUSAO: item.data_limite_conclusao,
      NOME_OBJETIVO: item.nome_objetivo,
      DATA_CONCLUSAO_OBJETIVO: item.data_conclusao_objetivo
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Objetivos:", error);
    return res.status(500).json({
      error: "Erro interno ao sincronizar Objetivos",
      details: error.message
    });
  }
}

controllers.syncRequisitosMobile = async (req, res) => {
  try {
    const requisitos = await Requisitos.findAll();

    const data = requisitos.map(item => ({
      ID_REQUISITO: item.id_requisito,
      ID_BADGE: item.id_badge,
      NOME_REQUISITO: item.nome_requisito,
      DESCRICAO_REQUISITO: item.descricao_requisito,
      IMAGEM_REQUISITO: item.imagem_requisito,
      ESTADO_A_I_: item.estado_a_i
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Requisitos:", error);
    return res.status(500).json({
      error: "Erro interno ao sincronizar Requisitos",
      details: error.message
    });
  }
}

controllers.syncDocumentacoesMobile = async (req, res) => {
  try {
    const { id } = req.params; // id_consultor

    if (!id) {
      return res.status(400).json({ error: "ID do consultor é obrigatório" });
    }

    const docs = await Documentacoes.findAll({
      where: { id_consultor: id }
    });

    const data = docs.map(item => ({
      ID: item.id_documentacao,
      ID_HISTORICO: item.id_historico,
      ID_CONSULTOR: item.id_consultor,
      DOCUMENTACAO: item.documentacao
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no sync de Documentações:", error);
    return res.status(500).json({
      error: "Erro interno ao sincronizar Documentações",
      details: error.message
    });
  }
}


module.exports = controllers;
