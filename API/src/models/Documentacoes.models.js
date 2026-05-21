var Sequelize = require("sequelize");
var sequelize = require("../../database");
var Consultor = require("./Consultores.models");
var HistoricoPedidos = require("./HistoricoPedidos.models");
var Requisito = require("./Requisitos.models");

var Documentacoes = sequelize.define(
  "Documentacoes",
  {
    id_documentacao: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_historico: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: HistoricoPedidos,
        key: "id_historico",
      },
    },
    id_consultor: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Consultor, key: "id_consultor" },
    },

    documentacao: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    
  },
);

Documentacoes.belongsTo(Consultor, { foreignKey: "id_consultor" });
Documentacoes.belongsTo(HistoricoPedidos, { foreignKey: "id_historico" });

HistoricoPedidos.hasMany(Documentacoes, { foreignKey: "id_historico" });;

module.exports = Documentacoes;