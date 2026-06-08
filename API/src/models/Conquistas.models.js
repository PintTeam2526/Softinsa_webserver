var Sequelize = require('sequelize');
var sequelize = require('../../database');

var Conquistas = sequelize.define('Conquistas',
{
    id_conquista: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descricao_conquista: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pontos_conquista: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tipo_conquista: {
        type: Sequelize.ENUM('badges', 'pontos'),
        allowNull: false
    },
    valor_conquista: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    timestamps: true
});

async function popularConquistas() {
    const total = await Conquistas.count();

    if (total === 0) {
        await Conquistas.bulkCreate([
            { id_conquista: 1,  descricao_conquista: '1 badge',    pontos_conquista: 10, tipo_conquista: 'badges', valor_conquista: 1   },
            { id_conquista: 2,  descricao_conquista: '5 badges',   pontos_conquista: 20, tipo_conquista: 'badges', valor_conquista: 5   },
            { id_conquista: 3,  descricao_conquista: '10 badges',  pontos_conquista: 30, tipo_conquista: 'badges', valor_conquista: 10  },
            { id_conquista: 4,  descricao_conquista: '25 badges',  pontos_conquista: 40, tipo_conquista: 'badges', valor_conquista: 25  },
            { id_conquista: 5,  descricao_conquista: '50 badges',  pontos_conquista: 50, tipo_conquista: 'badges', valor_conquista: 50  },
            { id_conquista: 6,  descricao_conquista: '50 pontos',  pontos_conquista: 10, tipo_conquista: 'pontos', valor_conquista: 50  },
            { id_conquista: 7,  descricao_conquista: '100 pontos', pontos_conquista: 20, tipo_conquista: 'pontos', valor_conquista: 100 },
            { id_conquista: 8,  descricao_conquista: '200 pontos', pontos_conquista: 30, tipo_conquista: 'pontos', valor_conquista: 200 },
            { id_conquista: 9,  descricao_conquista: '300 pontos', pontos_conquista: 40, tipo_conquista: 'pontos', valor_conquista: 300 },
            { id_conquista: 10, descricao_conquista: '500 pontos', pontos_conquista: 50, tipo_conquista: 'pontos', valor_conquista: 500 },
        ]);
    }
}

Conquistas.afterSync(popularConquistas);

module.exports = Conquistas;