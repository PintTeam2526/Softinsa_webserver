const Badges = require('../models/Badges.models');
const devolverEstadoBadgeService = require('../services/devolverEstadoBadge.service');
const Areas = require('../models/Areas.models');
const ServiceLines = require('../models/ServiceLines.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const PedidosBadges = require('../models/PedidosBadges.models');

const controllers = {};

// Mostrar todos os badges
controllers.getAllBadges = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        const whereClause = isAdmin ? {} : { estado_a_i: true };

        const resultado = await Badges.findAll({
            where: whereClause
        });

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar badges",
            erro: error.message
        });
    }
};

// Mostrar badge por ID
controllers.getBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";
        const id = req.params.id;

        const resultado = await Badges.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Badge não existe"
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
            mensagem: "Erro ao buscar badge",
            erro: error.message
        });
    }
};

// Criar badge
controllers.createBadge = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i
        } = req.body;

        if (estado_a_i !== false) {
            const area = await Areas.findByPk(id_area);
            if (!area || area.estado_a_i === false) {
                return res.status(400).json({
                    mensagem: "Não é possível criar um Badge ativo numa Área inativa"
                });
            }
        }

        await Badges.create({
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i,
            data_insercao: new Date() // DATA ATUAL
        });

        return res.status(201).json({
            mensagem: "Badge criado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao criar badge",
            erro: error.message
        });
    }
};

// Eliminar badge
controllers.deleteBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const resultado = await Badges.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        resultado.estado_a_i = false;

        await resultado.save();

        return res.status(200).json({
            mensagem: "Badge eliminado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar badge",
            erro: error.message
        });
    }
};

// Atualizar badge
controllers.updateBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const badge = await Badges.findByPk(id);

        if (!badge) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        const {
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i
        } = req.body;

        if (id_area !== undefined && id_area !== badge.id_area) {
            const area = await Areas.findByPk(id_area);
            if (!area || area.estado_a_i === false) {
                return res.status(400).json({
                    mensagem: "Não é possível associar a uma Área inativa"
                });
            }
        }

        badge.id_area = id_area ?? badge.id_area;
        badge.nome_badge = nome_badge ?? badge.nome_badge;
        badge.descricao_badge = descricao_badge ?? badge.descricao_badge;
        badge.pontos_badge = pontos_badge ?? badge.pontos_badge;
        badge.pago = pago ?? badge.pago;
        badge.nivel_badge = nivel_badge ?? badge.nivel_badge;
        badge.imagem_badge = imagem_badge ?? badge.imagem_badge;
        badge.sla = sla ?? badge.sla;
        badge.validade = validade ?? badge.validade;
        badge.estado_a_i = estado_a_i ?? badge.estado_a_i;

        badge.data_insercao = new Date(); // DATA ATUALIZADA

        await badge.save();

        return res.status(200).json({
            mensagem: "Badge atualizado com sucesso",
            dados: badge
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar badge",
            erro: error.message
        });
    }
};

// Devolver estado do badge
controllers.devolverEstadoBadge = async (req, res) => {
    try {
        const estado = await devolverEstadoBadgeService.devolverEstadoBadge(
            req.params.id_badge,
            req.params.id_consultor
        );
        res.json({estado});
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

controllers.devolverEstadoBadgeMobile = async (req, res) => {
    try {
        const estado = await devolverEstadoBadgeService.devolverEstadoBadge(
            req.params.id_badge,
            req.params.id_consultor
        );
        res.json(estado);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

controllers.getBadgesByAreaIDMobile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("ERRO! Tens de enviar o Id da Area");
  }

  try {

    const response = await Badges.findAll({
      where: { id_area: id },
      include: [
      {
        model: Areas,
        attributes: [
          'nome_area'
        ]
      }
      ]
    });

    const dados = response.map(item => ({
      ID_BADGE: item.id_badge,
      ID_AREA: item.id_area,
      NOME_BADGE: item.nome_badge,
      DESCRICAO_BADGE: item.descricao_badge,
      PONTOS_BADGE: item.pontos_badge,
      PAGO: item.pago,
      NIVEL_BADGE: item.nivel_badge,
      IMAGEM_BADGE: item.imagem_badge,
      nome_area_pai: item.Area.nome_area,
      ESTADO_A_I_: item.estado_a_i,
      DATA_INSERCAO: item.data_insercao
    }));

    res.json(dados);


  }catch (err) {
    return res.status(500).json({ error: err.message });
  }

}

controllers.getBadgeByIdMobile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Tens de enviar o id do badge no url");
  }

  const response = await Badges.findOne({
    where: { id_badge: id },
    include: [
      {
        model: Areas,
        attributes: [
          'nome_area'
        ]
      }
    ]
  });

  
  const dados = {
    ID_BADGE: response.id_badge,
    ID_AREA: response.id_area,
    NOME_BADGE: response.nome_badge,
    DESCRICAO_BADGE: response.descricao_badge,
    PONTOS_BADGE: response.pontos_badge,
    PAGO: response.pago,
    NIVEL_BADGE: response.nivel_badge,
    IMAGEM_BADGE: response.imagem_badge,
    nome_area_pai: response.Area.nome_area,
    ESTADO_A_I_: response.estado_a_i,
    DATA_INSERCAO: response.data_insercao
  };

  res.json([dados]);
  
}

//BADGES CONCLUIDOS MOBILE
//BADGES CONCLUIDOS MOBILE
controllers.getBadgesObtidosConsultorMobile = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: "ID do consultor é obrigatório" });
      }
  
      // Usamos BadgesConcluidos como base para garantir que trazemos tudo o que existe na tabela
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
      
      if (!conquistas || conquistas.length === 0) {
        return res.json([]);
      }

      // Formatação exata para o factory BadgesConcluidosModel.fromJson do Dart
      const resultado = conquistas.map(c => {
        const b = c.Badge;
        const area = b?.Area;
        const sl = area?.ServiceLine;

        return {
          ID_BADGE_CONCLUIDO: c.id_badge_concluido,
          ID_BADGE: b?.id_badge,
          NOME_BADGE: b?.nome_badge || "Sem Nome",
          nome_area_pai: area?.nome_area || "Sem Área", // Lowercase como no Dart
          NIVEL_BADGE: b?.nivel_badge || "",
          PONTOS_BADGE: b?.pontos_badge || 0, // Adicionado (faltava)
          IMAGEM_BADGE: b?.imagem_badge || "",
          nome_sl_pai: sl?.nome_service_line || "N/A", // Lowercase como no Dart
          DATA_CONCLUSAO: c.data_conclusao_badge,
          VALIDADE: b?.validade // Adicionado para o cálculo da expiração no Dart
        };
      });
  
      res.json(resultado);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao procurar Badges concluidos do consultor", details: err.message });
    }
};


module.exports = controllers;