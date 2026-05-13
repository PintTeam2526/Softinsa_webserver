var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Utilizador = require('./Utilizadores.models');
var ServiceLine = require('./ServiceLines.models');

var ServiceLineLiders = sequelize.define('ServiceLineLiders',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id_utilizador'
        },
    },
     id_service_line_lider: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_service_line: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ServiceLine,
            key: 'id_service_line'
        },
    },
},


{
    timestamps: false
});


ServiceLineLiders.belongsTo(Utilizador, { foreignKey: 'id_utilizador' });
ServiceLineLiders.belongsTo(ServiceLine, { foreignKey: 'id_service_line' });

module.exports = ServiceLineLiders;



