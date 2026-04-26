// arquivo temp de criação de utilizadores

const bcrypt = require('bcrypt');
const sequelize = require('./database');
const Utilizadores = require('./src/models/Utilizadores.models');
const Administradores = require('./src/models/Administradores.models');
const LearningPaths = require('./src/models/LearningPaths.models');
const ServiceLines = require('./src/models/ServiceLines.models');
const ServiceLineLiders = require('./src/models/ServiceLineLiders.models');
const Areas = require('./src/models/Areas.models');
const Consultores = require('./src/models/Consultores.models');
const Objetivos = require('./src/models/Objetivos.models');
const BadgesConcluidos = require('./src/models/BadgesConcluidos.models');
const Badges = require('./src/models/Badges.models');
const TalentManagers = require('./src/models/TalentManagers.models');
const PedidosBadge = require('./src/models/PedidosBadge.models');
const Documentacoes = require('./src/models/Documentacoes.models');
const NotificacoesAdmin = require('./src/models/NotificacoesAdmin.models');
const Enviadas = require('./src/models/Enviadas.models');
const HistoricoPedidos = require('./src/models/HistoricoPedidos.models');
const Estados = require('./src/models/Estados.models');
const Favoritos = require('./src/models/Favoritos.models');
const NotificacoesPedidos = require('./src/models/NotificacoesPedidos.models');
const Politicas = require('./src/models/Potilicas.models');
const PoliticasAceites = require('./src/models/PoliticasAceites.models');
const EstadoPedidos = require('./src/models/EstadoPedidos.models');
const Requisitos = require('./src/models/Requisitos.models');



const seed = async () => {
    try {
        await sequelize.sync();

        // 🔐 passwords encriptadas
        const password1 = await bcrypt.hash('123456', 10);
        const password2 = await bcrypt.hash('admin123', 10);

        // 🚀 inserir dados
        /* 
        await Utilizadores.bulkCreate([{
            id_utilizador: 1,
            nome_utilizador: 'João Silva',
            email_utilizador: 'joao@email.com',
            password_utilizador: password1,
            username_utilizador: 'joao.silva',
            tipo_utilizador: 'CO',
            estado_A_I_: true
        },
        {
            id_utilizador: 2,
            nome_utilizador: 'Maria Costa',
            email_utilizador: 'maria@email.com',
            password_utilizador: password1,
            username_utilizador: 'maria.costa',
            tipo_utilizador: 'CO',
            estado_A_I_: true
        },
        {
            id_utilizador: 3,
            nome_utilizador: 'Admin Sistema',
            email_utilizador: 'admin@email.com',
            password_utilizador: password2,
            username_utilizador: 'admin',
            tipo_utilizador: 'AD',
            estado_A_I_: true
        },
        {
            id_utilizador: 4,
            nome_utilizador: 'User Inativo',
            email_utilizador: 'inativo@email.com',
            password_utilizador: password1,
            username_utilizador: 'user.inativo',
            tipo_utilizador: 'CO',
            estado_A_I_: false
        }
    ]); */

        console.log('✅ Dados de teste inseridos com sucesso!');
        process.exit();

    } catch (error) {
        console.error('❌ Erro ao inserir dados:', error);
        process.exit(1);
    }
};

seed();
