var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var Conquista = require('./Conquistas.models');

var ConquistasConsultores = sequelize.define('ConquistasConsultores',
{
    id_conquista_consultor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Consultor,
            key: 'id_consultor'
        },
    },
    id_conquista: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Conquista,
            key: 'id_conquista'
        },
    },
    progresso: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},


{
    timestamps: true
});

ConquistasConsultores.belongsTo(Consultor, { foreignKey: 'id_consultor' });
ConquistasConsultores.belongsTo(Conquista, { foreignKey: 'id_conquista' });

module.exports = ConquistasConsultores;
