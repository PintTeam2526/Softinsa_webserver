//Criaçao das tabelas na BD

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
const Conquistas = require('./src/models/Conquistas.models');
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
const ConquistasConsultores = require('./src/models/ConquistasConsultores.models');



const setup = async () => {
    try {
        // Utilizar apenas se se quiser recrear TODA a base de dados do zero
        await sequelize.sync({force : true});
        //senão usar este:
        //await sequelize.sync();

        console.log('✅ Tabelas criadas!');
        process.exit();

    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
};

setup();
