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
    id_requisito: {
      type: Sequelize.INTEGER,
      allowNull: true, // passa a ser opcional se nem sempre houver requisito associado
      references: { model: Requisito, key: "id_requisito" },
    },
    documentacao: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    validado: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    id_utilizador_validador: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    data_validacao: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    observacao_validacao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["id_historico", "id_requisito"],
      },
    ],
  },
);

Documentacoes.belongsTo(Consultor, { foreignKey: "id_consultor" });
Documentacoes.belongsTo(HistoricoPedidos, { foreignKey: "id_historico" });
Documentacoes.belongsTo(Requisito, { foreignKey: "id_requisito" });

HistoricoPedidos.hasMany(Documentacoes, { foreignKey: "id_historico" });
Requisito.hasMany(Documentacoes, { foreignKey: "id_requisito" });

module.exports = Documentacoes;