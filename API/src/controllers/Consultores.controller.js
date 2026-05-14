const sequelize = require('../../database');
const { Op } = require('sequelize');
const editarDadosService = require('../services/editarDados.service');
const Consultores = require('../models/Consultores.models');
const Utilizador = require('../models/Utilizadores.models');
const Area = require('../models/Areas.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Badges = require('../models/Badges.models');
const Objetivos = require('../models/Objetivos.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Notificacoes = require('../models/NotificacoesPedidos.models');

const controllers = {};

controllers.editarDados = async (req, res) => {
    try {
        const resultado = await editarDadosService.editarDadosConsultor({
            id_consultor: req.params.id,
            nome: req.body.nome,
            email: req.body.email,
            id_area: req.body.id_area,
            foto_perfil: req.body.foto_perfil,
            password: req.body.password
        });
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


controllers.getConsultorByIdMobile = async (req, res) => {
  const { id } = req.params;

  try {
    const consultor = await Consultores.findOne({
      where: { id_consultor: id },
      include: [
        {
          model: Utilizador,
          attributes: ['nome_utilizador', 'email_utilizador', 'username_utilizador', 'imagem_utilizador'],
          where: { estado_a_i: true }
        },
        {
          model: Area,
          attributes: ['id_area', 'nome_area']
        }
      ]
    });

    if (!consultor) {
      return res.status(404).json({ error: "Consultor não encontrado" });
    }

    // ENVIAR UM JSON COM A RESPOSTA PARA O MOBILE (ESTILO SQL SERVER)
    const respostaParaFlutter = {
      ID_CONSULTOR: consultor.id_consultor,
      TOTAL_PONTOS: consultor.total_pontos ?? 0,
      ID_AREA_PREFERENCIA: consultor.Area?.id_area ?? 0,
      NOME_AREA_PREFERENCIA: consultor.Area?.nome_area ?? "N/A",
      NOME_UTILIZADOR: consultor.Utilizadore?.nome_utilizador ?? "",
      EMAIL_UTILIZADOR: consultor.Utilizadore?.email_utilizador ?? "",
      USERNAME_UTILIZADOR: consultor.Utilizadore?.username_utilizador ?? "",
      IMAGEM_PERFIL: consultor.Utilizadore?.imagem_utilizador ?? ""
    };

    // Retorna dentro de um array [] porque o Flutter costuma receber listas de queries SQL
    res.json([respostaParaFlutter]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

controllers.getCountBadgesObtidosByConsultorMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Tem de enviar na url o id do consultor' });
  }

  try {
    const count = await BadgesConcluidos.count({
      where: { 
        id_consultor: id 
      }
    });

    res.json([{
      COUNT_BADGES_OBTIDOS: count
    }]);

  } catch (err) {
    console.error("Erro ao contar badges: ", err);
    res.status(500).json({ error: "Erro ao buscar a contagem de badges" });
  }
};

controllers.getCountBadgesPorObterMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID do consultor é obrigatório' });
  }

  try {
    // 1. Contamos os Badges
    const count = await Badges.count({
      include: [
        {
          model: BadgesConcluidos,
          required: false, // Força o LEFT JOIN
          where: { 
            id_consultor: id
          }
        }
      ],
      where: {
        // Filtro: bc.ID_BADGE IS NULL
        // Isso garante que contamos apenas os badges que NÃO têm correspondência em BadgesConcluidos
        '$BadgesConcluidos.id_badge$': { [Op.is]: null }
      }
    });

    res.json([{
      COUNT_BADGES_POR_OBTER: count
    }]);

  } catch (err) {
    console.error("Erro na query de badges por obter: ", err);
    res.status(500).json({ error: "Erro ao calcular badges por obter" });
  }
  };

  controllers.getCountObjetivosPorConcluirMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID do consultor é obrigatório' });
  }

  try {
    const count = await Objetivos.count({
      where: {
        id_consultor: id,
        data_conclusao_objetivo: null
      }
    });

    res.json([{
      COUNT_OBJETIVOS_POR_CONCLUIR: count
    }]);

  } catch (err) {
    console.error("Erro ao contar objetivos por concluir: ", err);
    res.status(500).json({ error: "Erro ao calcular objetivos por concluir" });
  }
  };

  controllers.getDiasObjetivoExpirarMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID do consultor é obrigatório' });
  }

  try {
    const result = await Objetivos.findAll({
      attributes: [
        [
          sequelize.fn('MIN', sequelize.literal('CAST(data_limite_conclusao AS DATE) - CURRENT_DATE')),
          'DIAS_OBJETIVO_MAIS_RECENTE_EXPIRAR'
        ]
      ],
      where: {
        id_consultor: id,
        data_conclusao_objetivo: null
      },
      raw: true
    });

    res.json(result);

  } catch (err) {
    console.error("Erro ao calcular dias para expirar: ", err);
    res.status(500).json({ error: "Erro ao calcular dias para expirar" });
  }
  };

controllers.getBadgesPorObterMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "É necessário introduzir o ID do consultor." });
  }

  try {
    const badges = await Badges.findAll({
      include: [
        {
          model: Area,
          attributes: ['nome_area']
        },
        {
          model: BadgesConcluidos,
          required: false,
          where: { id_consultor: id }
        },
        {
          model: PedidosBadges,
          required: false,
          where: { id_consultor: id }
        }
      ],
      where: {
        // bc.id_badge IS NULL
        '$BadgesConcluidos.id_badge$': { [Op.is]: null },
        // (pb.id_badge IS NULL OR pb.estado_atual IN (3, 5, 6))
        [Op.or]: [
          { '$PedidosBadges.id_badge$': { [Op.is]: null } },
          { '$PedidosBadges.estado_atual$': { [Op.in]: [3, 5, 6] } }
        ]
      }
    });

    // Mapear para o formato que o Flutter espera (chaves em MAIÚSCULAS)
    const respostaFormatada = badges.map(b => ({
      ID_BADGE: b.id_badge,
      ID_AREA: b.id_area,
      NOME_BADGE: b.nome_badge,
      DESCRICAO_BADGE: b.descricao_badge,
      PONTOS_BADGE: b.pontos_badge,
      PAGO: b.pago,
      NIVEL_BADGE: b.nivel_badge,
      IMAGEM_BADGE: b.imagem_badge,
      DATA_INSERCAO: b.data_insercao,
      ESTADO_A_I_: b.estado_a_i,
      nome_area_pai: b.Area ? b.Area.nome_area : null
    }));

    res.json(respostaFormatada);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erro interno no servidor ao devolver a lista de badges por concluir do consultor.",
    });
  }
};

//Adicionar um objetivo do consultor
controllers.createObjetivo = async (req, res) => {
    try {
        const idConsultor = req.params.id;
        const resultado = await Objetivos.create({
            ...req.body,
            id_consultor: idConsultor
        });
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao criar objetivo", erro: error.message });
    }
};

//Apagar um objetivo do consultor
controllers.deleteObjetivoById = async (req, res) => {
    try {
        const idConsultor = req.params.id;
        const { id_objetivo } = req.body;
        await Objetivos.destroy({
            where: {
                id_objetivo,
                id_consultor: idConsultor
            }
        });
        return res.json({ message: 'Objetivo eliminado' });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao eliminar objetivo", erro: error.message });
    }
};

// Listar notificações de um utilizador
controllers.getAllNotificacoes = async (req, res) => {
    try {
        const idConsultor = req.params.id;
        const resultado = await Notificacoes.findAll({
            where: {
                id_consultor: idConsultor
            }
        });
        return res.json(resultado);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar notificações", erro: error.message });
    }
};

// Enviar uma notificação
controllers.createNotificacao = async (req, res) => {
    try {
        const idConsultor = req.params.id;
        const resultado = await Notificacoes.create({
            ...req.body,
            id_consultor: idConsultor
        });
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao criar notificação", erro: error.message });
    }
};

  module.exports = controllers;
