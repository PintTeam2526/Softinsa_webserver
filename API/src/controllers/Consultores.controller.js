const sequelize = require('../../database');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const editarDadosService = require('../services/editarDados.service');
const Consultores = require('../models/Consultores.models');
const Utilizador = require('../models/Utilizadores.models');
const Area = require('../models/Areas.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Badges = require('../models/Badges.models');
const Objetivos = require('../models/Objetivos.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Notificacoes = require('../models/Notificacoes.models');
const ServiceLines = require('../models/ServiceLines.models');
const LearningPaths = require('../models/LearningPaths.models');
const sidebarService = require('../services/sidebar.service');

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

//MOBILE (EDITAR DADOS)
controllers.editarDadosConsultorMobile = async (req, res) => {
  try {

     if (req.user?.role !== 'c') {
        return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
      }

    const {
      idConsultor,
      nome,
      email,
      idAreaPreferencia,
      fotoPerfil,
      passwordNova,
      passwordAtual,
    } = req.body;
    let passNovaHash = null;

    if (!idConsultor) {
      return res
        .status(400)
        .json({ error: "Campo idConsultor é obrigatório." });
    }

    // 1. Verificar a password atual se fornecida
    if (passwordAtual) {
      const consultor = await Consultores.findOne({
        where: { id_consultor: idConsultor },
        include: [{ model: Utilizador }]
      });

      if (!consultor) {
        return res.status(404).json({ error: "Consultor não encontrado." });
      }

      const passHashBD = consultor.Utilizadore.password_utilizador;
      const passwordAtualValida = await bcrypt.compare(passwordAtual, passHashBD);

      if (!passwordAtualValida) {
        return res.status(401).json({ error: "A password atual está incorreta." });
      }

      // SE EXISTIR UMA PASSNOVA ENCRIPTA
      if (passwordNova) {
        const saltRounds = 10;
        passNovaHash = await bcrypt.hash(passwordNova, saltRounds);
      }
    }

    // 2. Realizar a atualização
    const transaction = await sequelize.transaction();

    try {
      const consultorParaUpdate = await Consultores.findOne({
        where: { id_consultor: idConsultor },
        transaction
      });

      if (!consultorParaUpdate) {
        await transaction.rollback();
        return res.status(404).json({ error: "Consultor não encontrado." });
      }

      // Atualizar Utilizador
      const updateDataUtilizador = {};
      if (nome) updateDataUtilizador.nome_utilizador = nome;
      if (email) updateDataUtilizador.email_utilizador = email;
      if (fotoPerfil) updateDataUtilizador.imagem_utilizador = fotoPerfil;
      if (passNovaHash) updateDataUtilizador.password_utilizador = passNovaHash;

      if (Object.keys(updateDataUtilizador).length > 0) {
        await Utilizador.update(updateDataUtilizador, {
          where: { id_utilizador: consultorParaUpdate.id_utilizador },
          transaction
        });
      }

      // Atualizar Consultor (área de preferência)
      if (idAreaPreferencia) {
        await Consultores.update({ id_area: idAreaPreferencia }, {
          where: { id_consultor: idConsultor },
          transaction
        });
      }

      await transaction.commit();

      // Buscar dados atualizados para retornar (estilo SQL Server result.recordset)
      const consultorAtualizado = await Consultores.findOne({
        where: { id_consultor: idConsultor },
        include: [
          { model: Utilizador },
          { model: Area }
        ]
      });

      const respostaParaFlutter = {
        ID_CONSULTOR: consultorAtualizado.id_consultor,
        NOME_UTILIZADOR: consultorAtualizado.Utilizadore?.nome_utilizador ?? "",
        EMAIL_UTILIZADOR: consultorAtualizado.Utilizadore?.email_utilizador ?? "",
        ID_AREA_PREFERENCIA: consultorAtualizado.id_area,
        IMAGEM_PERFIL: consultorAtualizado.Utilizadore?.imagem_utilizador ?? ""
      };

      return res.status(200).json({
        message: "Dados atualizados com sucesso!",
        data: [respostaParaFlutter]
      });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro interno no servidor ao atualizar dados do consultor.",
    });
  }
}

controllers.getConsultorByIdMobile = async (req, res) => {

   if (req.user?.role !== 'c') {
      return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
    }

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
  
  if (req.user?.role !== 'c') {
    return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
  }

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
  
  if (req.user?.role !== 'c') {
    return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
  }

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
  
  	if (req.user?.role !== 'c') {
    return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
  }

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
  
  	if (req.user?.role !== 'c') {
    return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
  }
  
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
  
  	if (req.user?.role !== 'c') {
    return res.status(403).json({ message: 'Token Invalido: Apenas consultores registados podem aceder' });
  }

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
controllers.perfilPublico = async (req, res) => {
    try {
        const idConsultor = req.params.id;

        const consultor = await Consultores.findByPk(idConsultor, {
            include: [
                {
                    model: Utilizador,
                    attributes: ['nome_utilizador', 'imagem_utilizador', 'email_utilizador']
                },
                {
                    model: Area,
                    attributes: ['nome_area'],
                    include: [
                        {
                            model: ServiceLines,
                            attributes: ['nome_service_line'],
                            include: [
                                {
                                    model: LearningPaths,
                                    attributes: ['nome_learning_path']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: BadgesConcluidos,
                    attributes: ['data_conclusao_badge'],
                    include: [
                        {
                            model: Badges,
                            attributes: ['id_badge', 'nome_badge', 'imagem_badge', 'nivel_badge']
                        }
                    ]
                }
            ]
        });

        if (!consultor) {
            return res.status(404).json({ mensagem: "Consultor não encontrado." });
        }

        const resultado = {
            nome: consultor.Utilizadore?.nome_utilizador,
            foto: consultor.Utilizadore?.imagem_utilizador,
            email: consultor.Utilizadore?.email_utilizador,
            total_pontos: consultor.total_pontos || 0,
            total_badges: consultor.BadgesConcluidos.length,
            area: consultor.Area?.nome_area,
            service_line: consultor.Area?.ServiceLine?.nome_service_line,
            learning_path: consultor.Area?.ServiceLine?.LearningPath?.nome_learning_path,
            badges: consultor.BadgesConcluidos.map(bc => ({
                id_badge: bc.Badge?.id_badge,
                nome: bc.Badge?.nome_badge,
                imagem: bc.Badge?.imagem_badge,
                nivel: bc.Badge?.nivel_badge,
                data_conclusao: bc.data_conclusao_badge
            }))
        };

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter perfil público.", erro: error.message });
    }
};

//obter área e os seus badges para a sidebar do consultor
controllers.getAreaEBadges = async (req, res) => {
    
    try {
        const isConsultor = req.user?.role === "c";

        if (!isConsultor) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id_consultor = req.user.id_consultor;
        const resultado = await sidebarService.getAreaEBadges(id_consultor);
        res.json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({mensagem: "Erro de servidor"});
    }
};


  module.exports = controllers;
