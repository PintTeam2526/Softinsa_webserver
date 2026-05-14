const Requisitos = require('../models/Requisitos.models');
const Badges = require('../models/Badges.models');


const controllers = {};

controllers.getRequisitosBadgeMobile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Tens de enviar o id do badge por parametro" });
    }

    const response = await Requisitos.findAll({
      where: { id_badge: id }
    });

    const dados = response.map(item => ({
      ID_REQUISITO: item.id_requisito,
      ID_BADGE: item.id_badge,
      NOME_REQUISITO: item.nome_requisito,
      DESCRICAO_REQUISITO: item.descricao_requisito,
      IMAGEM_REQUISITO: item.imagem_requisito,
      ESTADO_A_I_: item.estado_a_i
    }));

    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = controllers;
