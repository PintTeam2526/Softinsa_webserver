var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var TalentManager = require('./TalentManagers.models');
var ServiceLineLider = require('./ServiceLineLiders.models');
var Badge = require('./Badges.models');

var PedidosBadge = sequelize.define('PedidosBadge',
{
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Consultor,
            key: 'id_consultor'
        },
    },
    id_talent_manager: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: TalentManager,
            key: 'id_talent_manager'
        },
    },
    id_service_line_lider: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ServiceLineLider,
            key: 'id_service_line_lider'
        },
    },
    id_badge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Badge,
            key: 'id_badge'
        },
    },
    estado_atual: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},


{
    timestamps: false
});

PedidosBadge.belongsTo(Consultor);
PedidosBadge.belongsTo(TalentManager);
PedidosBadge.belongsTo(ServiceLineLider);
PedidosBadge.belongsTo(Badge);

module.exports = PedidosBadge;