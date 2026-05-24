const Sequelize = require("sequelize");
const sequelize = require("../../database");
const Pedidos = require("../models/PedidosBadges.models");
const HistoricoPedidos = require("../models/HistoricoPedidos.models");
const NotificacoesPedidos = require("../models/NotificacoesPedidos.models");
const BadgesConcluidos = require("../models/BadgesConcluidos.models");
const TalentManager = require("../models/TalentManagers.models");
const Badges = require("../models/Badges.models");
const Area = require("../models/Areas.models");
const ServiceLineLider = require("../models/ServiceLineLiders.models");
const PedidosBadges = require("../models/PedidosBadges.models");
const Documentacoes = require("../models/Documentacoes.models")
const devolverEstadoBadgeService = require("../services/devolverEstadoBadge.service");
const DocumentacaoTemporaria = require("../models/DocumentacaoTemporaria.models")
const Consultor = require("../models/Consultores.models");
const Utilizador = require("../models/Utilizadores.models");
const controllers = {};

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function isAdmin(req) {
  return req.user?.role === "a";
}

function isTM(req) {
  return req.user?.role === "t";
}

function isSL(req) {
  return req.user?.role === "s";
}

function isConsultor(req) {
  return req.user?.role === "c";
}

async function criarHistorico(
  idPedido,
  idEstado,
  idUser,
  motivo = null
) {
  await HistoricoPedidos.create({
    id_pedido_badge: idPedido,
    id_estado: idEstado,
    id_user: idUser,
    motivo: motivo,
    data: new Date(),
  });
}

async function criarNotificacao(idConsultor, idPedido, texto) {
  await NotificacoesPedidos.create({
    id_consultor: idConsultor,
    id_pedido_badge: idPedido,
    justificacao: texto,
    data_envio_notificacao: new Date(),
  });
}

async function escolherTalentManager() {
  const tms = await TalentManager.findAll();

  let melhorTM = null;
  let menorCarga = Infinity;

  for (const tm of tms) {
    const carga = await Pedidos.count({
      where: {
        id_talent_manager: tm.id_talent_manager,
        estado_atual: {
          [Sequelize.Op.notIn]: [4, 5], // aprovado / rejeitado
        },
      },
    });

    if (carga < menorCarga) {
      menorCarga = carga;
      melhorTM = tm;
    }
  }

  return melhorTM;
}

/* =====================================================
   GET TODOS PEDIDOS
===================================================== */

controllers.getAllPedidos = async (req, res) => {
  try {
    if (req.user.role === "guest") {
      return res.status(401).json({
        mensagem: "Utilizador não autenticado",
      });
    }

    let whereClause = {};

    if (isConsultor(req)) {
      whereClause.id_consultor = req.user.id_consultor;
    } else if (isTM(req)) {
      whereClause.id_talent_manager = req.user.id_talent_manager;
    } else if (isSL(req)) {
      whereClause.id_service_line_lider = req.user.id_service_line_lider;
    }

    const pedidos = await Pedidos.findAll({
      where: whereClause,
      include: [
        { model: Badges },
        {
          model: Consultor,
          include: [{ model: Utilizador }],
        },
      ],
    });

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar pedidos",
      erro: error.message,
    });
  }
};

/* =====================================================
   GET PEDIDO ID
===================================================== */

controllers.getPedidoById = async (req, res) => {
  try {
    if (req.user.role === "guest") {
      return res.status(401).json({
        mensagem: "Utilizador não autenticado",
      });
    }

    const pedido = await Pedidos.findByPk(req.params.id, {
      include: [
        { model: Badges },
        {
          model: Consultor,
          include: [{ model: Utilizador }],
        },
      ],
    });

    if (!pedido) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado",
      });
    }

    const accessMap = {
      c: pedido.id_consultor === req.user.id_consultor,
      t: pedido.id_talent_manager === req.user.id_talent_manager,
      s: pedido.id_service_line_lider === req.user.id_service_line_lider,
      a: true,
    };

    if (!accessMap[req.user.role]) {
      return res.status(401).json({
        mensagem: "Utilizador não autorizado",
      });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar pedido",
      erro: error.message,
    });
  }
};

/* =====================================================
   CRIAR PEDIDO
===================================================== */

controllers.createPedido = async (req, res) => {
  try {
    if (!isConsultor(req) && !isAdmin(req)) {
      return res.status(401).json({
        mensagem: "Utilizador não autorizado",
      });
    }

    const { id_badge, sessao_id } = req.body;
    const id_consultor = req.user.id_consultor;

    const pedidoExistente = await Pedidos.findOne({
      where: {
        id_consultor,
        id_badge,
        estado_atual: {
          [Sequelize.Op.notIn]: [3, 4, 5, 6],
        },
      },
    });

    if (pedidoExistente) {
      return res.status(400).json({
        mensagem: "Já possui um pedido em análise ou aberto para este badge.",
      });
    }

    const tm = await escolherTalentManager();
    if (!tm) {
      return res.status(500).json({
        mensagem: "Nenhum Talent Manager disponível",
      });
    }

    const badge = await Badges.findByPk(id_badge);
    if (!badge) {
      return res.status(404).json({ mensagem: "Badge não encontrado" });
    }
    const area = await Area.findByPk(badge.id_area);
    if (!area) {
      return res.status(404).json({ mensagem: "Área não encontrada" });
    }
    const sl = await ServiceLineLider.findOne({
      where: { id_service_line: area.id_service_line },
    });
    const idServiceLineLider = sl ? sl.id_service_line_lider : 1;

    const transaction = await sequelize.transaction();

    try {
      const pedido = await Pedidos.create(
        {
          id_consultor,
          id_talent_manager: tm.id_talent_manager,
          id_service_line_lider: idServiceLineLider,
          id_badge,
          estado_atual: 1,
        },
        { transaction },
      );

      const historico = await HistoricoPedidos.create({
        id_pedido_badge: pedido.id_pedido_badge,
        id_estado: 1,
        data: new Date(),
      }, { transaction });

      if (sessao_id) {
        const docsTemporarios = await DocumentacaoTemporaria.findAll({
          where: { sessao_id }, transaction,
        });

        if (docsTemporarios.length === 0) {
          await transaction.rollback();
          return res.status(400).json({
            mensagem: "Nenhum documento temporário encontrado para esta sessão",
          });
        }

        for (const doc of docsTemporarios) {
          await Documentacoes.create({
            id_historico: historico.id_historico,   // <-- mudança chave
            id_consultor,
            documentacao: doc.documentacao
          }, { transaction });
        }

        await DocumentacaoTemporaria.destroy({
          where: { sessao_id }, transaction,
        });
      }

      await NotificacoesPedidos.create(
        {
          id_consultor,
          id_pedido_badge: pedido.id_pedido_badge,
          justificacao: "Novo pedido criado. Aguarda validação.",
          data_envio_notificacao: new Date(),
        },
        { transaction },
      );

      await transaction.commit();

      return res.status(201).json({
        mensagem: "Pedido criado com sucesso",
        dados: pedido,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar pedido",
      erro: error.message,
    });
  }
};

/* =====================================================
   TALENT MANAGER
===================================================== */
controllers.tmReview = async (req, res) => {
  try {
    if (!isTM(req) && !isAdmin(req)) {
      return res.status(401).json({
        mensagem: "Utilizador não autorizado",
      });
    }

    const { acao, motivo } = req.body;

    const pedido = await Pedidos.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        mensagem: "Pedido não existe",
      });
    }

    if (pedido.estado_atual !== 1) {
      return res.status(400).json({
        mensagem: "Pedido não está no estado 'submetido' para ser avaliado pelo Talent Manager",
      });
    }

    let estado;
    let mensagemHistorico;
    let mensagemNotificacao;
    let mensagemResposta;

    if (acao === "aprovar") {
      estado = 2;
      mensagemHistorico = "Aprovado pelo Talent Manager";
      mensagemNotificacao = "Pedido aprovado pelo Talent Manager.";
      mensagemResposta = "Pedido aprovado";
    } else if (acao === "devolver") {
      if (!motivo || motivo.trim() === "") {
        return res.status(400).json({
          mensagem: "É obrigatório indicar o motivo ao devolver um pedido.",
        });
      }
      estado = 3;
      mensagemHistorico = "Devolvido pelo Talent Manager";
      mensagemNotificacao = motivo;
      mensagemResposta = "Pedido devolvido";
    } else {
      return res.status(400).json({
        mensagem: "Ação inválida. Use 'aprovar' ou 'devolver'",
      });
    }

    pedido.estado_atual = estado;
    await pedido.save();

    await criarHistorico(
      pedido.id_pedido_badge,
      estado,
      req.user.id,
      acao !== "aprovar" ? motivo : null,
    );

    await criarNotificacao(
      pedido.id_consultor,
      pedido.id_pedido_badge,
      mensagemNotificacao,
    );

    return res.status(200).json({
      mensagem: mensagemResposta,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao processar pedido",
      erro: error.message,
    });
  }
};
/* =====================================================
   SERVICE LINE LIDER
===================================================== */

controllers.slReview = async (req, res) => {
  try {
    if (!isSL(req) && !isAdmin(req)) {
      return res.status(401).json({
        mensagem: "Utilizador não autorizado",
      });
    }

    const { acao, motivo } = req.body;

    const pedido = await Pedidos.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        mensagem: "Pedido não existe",
      });
    }

    if (isAdmin(req)) {
      if ([4, 5].includes(pedido.estado_atual)) {
        return res.status(400).json({
          mensagem: "Pedido já está num estado final (aprovado ou rejeitado)",
        });
      }
    } else {
      if (pedido.estado_atual !== 2) {
        return res.status(400).json({
          mensagem: "Pedido não está no estado 'correto' para ser avaliado pelo Service Line Líder",
        });
      }
    }

    if (isAdmin(req) && acao === "devolver") {
      return res.status(400).json({
        mensagem: "Admin não pode devolver pedidos. Use 'aprovar' ou 'rejeitar'",
      });
    }

    // Validar motivo para ações que não sejam aprovar
    if (acao !== "aprovar" && (!motivo || motivo.trim() === "")) {
      return res.status(400).json({
        mensagem: "É obrigatório indicar o motivo ao devolver ou rejeitar um pedido.",
      });
    }

    const acoes = {
      aprovar: {
        estado: 4,
        historico: "Aprovado final",
        notificacao: "Pedido aprovado. Badge atribuído.",
        resposta: "Pedido aprovado com sucesso",
      },
      devolver: {
        estado: 6,
        historico: "Devolvido pelo Service Line Líder",
        notificacao: motivo,
        resposta: "Pedido devolvido",
      },
      rejeitar: {
        estado: 5,
        historico: "Pedido rejeitado",
        notificacao: motivo,
        resposta: "Pedido rejeitado",
      },
    };

    const config = acoes[acao];

    if (!config) {
      return res.status(400).json({
        mensagem: "Ação inválida. Use 'aprovar', 'devolver' ou 'rejeitar'",
      });
    }

    pedido.estado_atual = config.estado;
    await pedido.save();

    if (acao === "aprovar") {
      await BadgesConcluidos.create({
        id_badge: pedido.id_badge,
        id_consultor: pedido.id_consultor,
        data_conclusao_badge: new Date(),
        url_validacao: "Interno",
      });
    }

    await criarHistorico(
      pedido.id_pedido_badge,
      config.estado,
      req.user.id,
      acao !== "aprovar" ? motivo : null,
    );

    await criarNotificacao(
      pedido.id_consultor,
      pedido.id_pedido_badge,
      config.notificacao,
    );

    return res.status(200).json({
      mensagem: config.resposta,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao processar pedido",
      erro: error.message,
    });
  }
};

/* =====================================================
   CONSULTOR
===================================================== */

/*controllers.resubmitPedido = async (req, res) => {
    try {
        if (!isConsultor(req) && !isAdmin(req)) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const pedido = await Pedidos.findByPk(req.params.id);

        if (!pedido) {
            return res.status(404).json({
                mensagem: "Pedido não existe"
            });
        }

        // 🔒 Garantir que só pode reenviar se foi devolvido
        const estadosPermitidos = [3, 6]; // devolvido TM ou SL

        if (!estadosPermitidos.includes(pedido.estado_atual)) {
            return res.status(400).json({
                mensagem: "Pedido não pode ser reenviado neste estado"
            });
        }

        // 🔄 Atualizar estado (volta para TM)
        pedido.estado_atual = 1;
        await pedido.save();

        // 📝 Histórico
        await criarHistorico(
            pedido.id_pedido_badge,
            1,
            req.user.id,
            "Pedido reenviado pelo consultor"
        );

        // 🔔 Notificação (podes adaptar para TM/SL se quiseres)
        await criarNotificacao(
            pedido.id_consultor,
            pedido.id_pedido_badge,
            "Pedido reenviado para nova avaliação."
        );

        return res.status(200).json({
            mensagem: "Pedido reenviado com sucesso"
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao reenviar pedido",
            erro: error.message
        });
    }
};*/

/* =====================================================
   HISTÓRICO DO PEDIDO
===================================================== */

controllers.getHistoricoPedido = async (req, res) => {
  try {
    if (req.user.role === "guest") {
      return res.status(401).json({ mensagem: "Utilizador não autenticado" });
    }

    const pedido = await Pedidos.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    const accessMap = {
      c: pedido.id_consultor === req.user.id_consultor,
      t: pedido.id_talent_manager === req.user.id_talent_manager,
      s: pedido.id_service_line_lider === req.user.id_service_line_lider,
      a: true,
    };

    if (!accessMap[req.user.role]) {
      return res.status(401).json({ mensagem: "Utilizador não autorizado" });
    }

    const historico = await HistoricoPedidos.findAll({
      where: { id_pedido_badge: req.params.id },
      include: [
        {
          model: PedidosBadges,
          include: [
            {
              model: Badges,
              attributes: ["id_badge", "nome_badge", "nivel_badge", "imagem_badge"],
            },
            {
              model: TalentManager,
              include: [{
                model: Utilizador,
                attributes: ["nome_utilizador", "tipo_utilizador"],
              }],
            },
            {
              model: ServiceLineLider,
              include: [{
                model: Utilizador,
                attributes: ["nome_utilizador", "tipo_utilizador"],
              }],
            },
          ],
        },
      ],
      order: [["data", "ASC"]],
    });

    const avaliadorMap = {
      1: null,       // consultor, sem avaliador
      2: "tm",
      3: "tm",
      4: "sl",
      5: "sl",
      6: "sl",
    };

    const resultado = historico.map((h) => {
      const tipo = avaliadorMap[h.id_estado];
      let nomeAvaliador = null;

      if (tipo === "tm") {
        nomeAvaliador = h.PedidosBadge?.TalentManager?.Utilizadore?.nome_utilizador ?? null;
      } else if (tipo === "sl") {
        nomeAvaliador = h.PedidosBadge?.ServiceLineLider?.Utilizadore?.nome_utilizador ?? null;
      }

      return {
        ...h.toJSON(),
        nome_avaliador: nomeAvaliador,
      };
    });
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar histórico",
      erro: error.message,
    });
  }
};

controllers.getBadgesCandidatadosMobile = async (req, res) => {
  try {
    const { idConsultor } = req.params;

    if (!idConsultor) {
      return res.status(400).json({ error: "ID do consultor é obrigatório" });
    }

    // 1. Procurar todos os pedidos deste consultor incluindo os dados do Badge
    // Equivalente ao INNER JOIN PEDIDOS_BADGE ON BADGES.ID_BADGE = PEDIDOS_BADGE.ID_BADGE
    const pedidos = await PedidosBadges.findAll({
      where: { id_consultor: idConsultor },
      include: [
        {
          model: Badges,
          attributes: ["id_badge", "nome_badge", "nivel_badge", "imagem_badge"],
        },
      ],
    });

    // 2. Aplicar o serviço devolverEstadoBadge a cada resultado
    // Usamos Promise.all porque o serviço é assíncrono
    const resultados = await Promise.all(
      pedidos.map(async (pedido) => {
        const badge = pedido.Badge;

        // Chamada ao seu serviço JS para obter o estado dinâmico
        const estado = await devolverEstadoBadgeService.devolverEstadoBadge(
          badge.id_badge,
          idConsultor,
        );

        return {
          ID_BADGE: badge.id_badge,
          NOME_BADGE: badge.nome_badge,
          NIVEL_BADGE: badge.nivel_badge,
          IMAGEM_BADGE: badge.imagem_badge,
          ESTADO_BADGE: estado, // Resultado do serviço
        };
      }),
    );

    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao procurar badges do consultor" });
  }
};

module.exports = controllers;
