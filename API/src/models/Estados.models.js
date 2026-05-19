var Sequelize = require('sequelize');
var sequelize = require('../../database');

var Estados = sequelize.define('Estados',
{
    id_estado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_estado: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_estado: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},

{
    timestamps: true
});

// Popular a tabela Estados
async function popularEstados() {
    const total = await Estados.count();

    // Só insere se tabela estiver vazia
    if (total === 0) {
        await Estados.bulkCreate([
            {
                id_estado: 1,
                nome_estado: 'submetido',
                descricao_estado: 'pelo consultor -> avança para TM'
            },
            {
                id_estado: 2,
                nome_estado: 'correto',
                descricao_estado: 'resposta do TM -> avança para SLL'
            },
            {
                id_estado: 3,
                nome_estado: 'incorreto',
                descricao_estado: 'resposta do TM -> devolução para o consultor com motivo'
            },
            {
                id_estado: 4,
                nome_estado: 'aprovado',
                descricao_estado: 'resposta do SLL -> end'
            },
            {
                id_estado: 5,
                nome_estado: 'rejeitado',
                descricao_estado: 'resposta do SLL -> end'
            },
            {
                id_estado: 6,
                nome_estado: 'devolvido',
                descricao_estado: 'resposta do SLL -> devolução para o consultor com motivo'
            }
        ]);
    }
}

Estados.afterSync(popularEstados);

module.exports = Estados;