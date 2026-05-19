const sequelize = require('../../database');
const { Op } = require('sequelize');
const Objetivos = require('../models/Objetivos.models');
const Badges = require('../models/Badges.models');
const Areas = require('../models/Areas.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');

const controllers = {};

controllers.getObjetivosConsultorMobile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
     return res.status(400).json({ error: 'Tens de enviar o id do Consultor!' });
  }
  try {
    const resultado = await Objetivos.findAll({
      where: { id_consultor: id }
    });

    if (!resultado || resultado.length === 0) {
      return res.json([]);
    }

    const resposta = resultado.map(obj => ({
      DATA_LIMITE_CONCLUSAO: obj.data_limite_conclusao,
      DATA_CONCLUSAO_OBJETIVO: obj.data_conclusao_objetivo,
      ID_OBJETIVO: obj.id_objetivo,
      ID_BADGE: obj.id_badge,
      ID_CONSULTOR: obj.id_consultor,
      NOME_OBJETIVO: obj.nome_objetivo
    }));

    res.json(resposta);

  } catch (err) {
     res.status(500).json({ error: err.message });
  }
}

controllers.badgesParaObjetivosMobile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
       return res.status(400).json({ error: 'Tens de enviar o id do Consultor!' });
    }

    // Executa a query filtrando badges disponíveis para novos objetivos
    const badges = await Badges.findAll({
      include: [{
        model: Areas,
        attributes: ['nome_area']
      }],
      where: {
        [Op.and]: [
          // 1. NOT EXISTS em BadgesConcluidos
          sequelize.literal(`NOT EXISTS (
            SELECT 1 FROM "BadgesConcluidos"
            WHERE "BadgesConcluidos".id_badge = "Badges".id_badge
            AND "BadgesConcluidos".id_consultor = ${id}
          )`),
          // 2. (NOT EXISTS Objetivo Ativo OR EXISTS Objetivo Expirado)
          {
            [Op.or]: [
              sequelize.literal(`NOT EXISTS (
                SELECT 1 FROM "Objetivos"
                WHERE "Objetivos".id_badge = "Badges".id_badge
                AND "Objetivos".id_consultor = ${id}
              )`),
              sequelize.literal(`EXISTS (
                SELECT 1 FROM "Objetivos"
                WHERE "Objetivos".id_badge = "Badges".id_badge
                AND "Objetivos".id_consultor = ${id}
                AND "Objetivos".data_limite_conclusao < CURRENT_DATE
              )`)
            ]
          }
        ]
      }
    });

    // Mapeamento exato para o factory BadgesModel.fromJson do Dart
    const resposta = badges.map(b => ({
      ID_BADGE: b.id_badge,
      ID_AREA: b.id_area,
      NOME_BADGE: b.nome_badge,
      DESCRICAO_BADGE: b.descricao_badge,
      PONTOS_BADGE: b.pontos_badge,
      PAGO: b.pago, // Mapeia para pago_S_N no Dart
      NIVEL_BADGE: b.nivel_badge,
      IMAGEM_BADGE: b.imagem_badge,
      nome_area_pai: b.Area?.nome_area || "N/A", // nome_area_pai em minúsculas como no Dart
      DATA_INSERCAO: b.data_insercao,
      ESTADO_A_I_: b.estado_a_i
    }));

    res.json(resposta);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


controllers.criarObjetivoConsultorMobile = async (req, res) => {
  try {
    const { idBadge, idConsultor, dataLimiteConclusao, nomeBadge } = req.body;

    // Verificação de campos obrigatórios
    if (!idBadge || !idConsultor || !dataLimiteConclusao || !nomeBadge) {
      return res.status(400).json({
        error: 'É necessário enviar no body os seguintes campos: idBadge, idConsultor, dataLimiteConclusao, nomeBadge.'
      });
    }

    // Criar o registo usando o modelo Sequelize
    await Objetivos.create({
      id_badge: idBadge,
      id_consultor: idConsultor,
      data_limite_conclusao: dataLimiteConclusao,
      nome_objetivo: nomeBadge,
      data_conclusao_objetivo: null, // Definido como null como no SQL original
      estado_objetivo: 'Por Concluir' // Campo obrigatório no seu modelo Sequelize
    });

    return res.status(200).json({
      success: true,
      message: 'Objetivo adicionado com sucesso.'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro interno no servidor ao criar um objetivo para o consultor.',
      details: err.message
    });
  }
}


module.exports = controllers;
