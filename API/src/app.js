var createError = require("http-errors");
var express = require("express");
var path = require("path");
var middlewareAuth = require("./middleware/auth.middleware");
const cors = require("cors");
const sequelize = require("../database");
const triggers = require('../triggersDatabase');

// Importar todos os modelos para o sync os reconhecer
const Utilizadores = require("./models/Utilizadores.models");
const Administradores = require("./models/Administradores.models");
const LearningPaths = require("./models/LearningPaths.models");
const ServiceLines = require("./models/ServiceLines.models");
const ServiceLineLiders = require("./models/ServiceLineLiders.models");
const Areas = require("./models/Areas.models");
const Consultores = require("./models/Consultores.models");
const Objetivos = require("./models/Objetivos.models");
const BadgesConcluidos = require("./models/BadgesConcluidos.models");
const Badges = require("./models/Badges.models");
const Conquistas = require("./models/Conquistas.models");
const TalentManagers = require("./models/TalentManagers.models");
const PedidosBadges = require("./models/PedidosBadges.models");
const Documentacoes = require("./models/Documentacoes.models");
const NotificacoesAdmin = require("./models/NotificacoesAdmin.models");
const Enviadas = require("./models/Enviadas.models");
const HistoricoPedidos = require("./models/HistoricoPedidos.models");
const Estados = require("./models/Estados.models");
const Favoritos = require("./models/Favoritos.models");
const NotificacoesPedidos = require("./models/NotificacoesPedidos.models");
const Politicas = require("./models/Politicas.models");
const Requisitos = require("./models/Requisitos.models");
const ConquistasConsultores = require("./models/ConquistasConsultores.models");
const DocumentacaoTemporaria = require("./models/DocumentacaoTemporaria.models");
const { seedDatabase } = require("./services/seed.service");

var app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" })); //PRECISO DE MAIS ESPACO PARA O BASE64 NO BODY
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//--------------MiddleWares-----------------
//Autenticação do sistema
app.use(middlewareAuth);

//Timeout global — evita pedidos órfãos
app.use(require("./middleware/timeout.middleware"));

const routes = require("./routes/Rotas");
app.use("/api", routes);

// Rota de teste
app.get("/api", (req, res) => {
  res.send("API a funcionar");
});

async function start() {
  try {
    await sequelize.sync({ force: true });
    //await sequelize.sync({ alter: true });
    console.log("✅ Tabelas sincronizadas!");

    // Criar triggers PostgreSQL
    await triggers.criarTriggers();

    await seedDatabase();

    app.listen(3000, () => {
      console.log("🚀 API a correr na porta 3000");
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar API:", error);
    process.exit(1);
  }
}

start();

module.exports = app;
