// arquivo temp de criação de utilizadores

const bcrypt = require('bcrypt');
const sequelize = require('./src/models/database');
const Utilizadores = require('./src/models/Utilizadores.models');

const seed = async () => {
    try {
        await sequelize.sync();

        // 🔐 passwords encriptadas
        const password1 = await bcrypt.hash('123456', 10);
        const password2 = await bcrypt.hash('admin123', 10);

        // 🚀 inserir dados
        await Utilizadores.bulkCreate([
            {
                ID_UTILIZADOR: 1,
                NOME_UTILIZADOR: 'João Silva',
                EMAIL_UTILIZADOR: 'joao@email.com',
                PASSWORD_UTILIZADOR: password1,
                USERNAME_UTILIZADOR: 'joao.silva',
                TIPO_UTILIZADOR: 'CO', // consultor
                ESTADO_A_I_: true
            },
            {
                ID_UTILIZADOR: 2,
                NOME_UTILIZADOR: 'Maria Costa',
                EMAIL_UTILIZADOR: 'maria@email.com',
                PASSWORD_UTILIZADOR: password1,
                USERNAME_UTILIZADOR: 'maria.costa',
                TIPO_UTILIZADOR: 'CO',
                ESTADO_A_I_: true
            },
            {
                ID_UTILIZADOR: 3,
                NOME_UTILIZADOR: 'Admin Sistema',
                EMAIL_UTILIZADOR: 'admin@email.com',
                PASSWORD_UTILIZADOR: password2,
                USERNAME_UTILIZADOR: 'admin',
                TIPO_UTILIZADOR: 'AD', // admin
                ESTADO_A_I_: true
            },
            {
                ID_UTILIZADOR: 4,
                NOME_UTILIZADOR: 'User Inativo',
                EMAIL_UTILIZADOR: 'inativo@email.com',
                PASSWORD_UTILIZADOR: password1,
                USERNAME_UTILIZADOR: 'user.inativo',
                TIPO_UTILIZADOR: 'CO',
                ESTADO_A_I_: false
            }
        ]);

        console.log('✅ Dados de teste inseridos com sucesso!');
        process.exit();

    } catch (error) {
        console.error('❌ Erro ao inserir dados:', error);
        process.exit(1);
    }
};

seed();
