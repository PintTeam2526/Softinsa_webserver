var createError = require('http-errors');
var express = require('express');
var path = require('path');
var middlewareAuth = require('./middleware/auth.middleware')
const cors = require("cors");


var app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' })); //PRECISO DE MAIS ESPACO PARA O BASE64 NO BODY
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//--------------MiddleWares-----------------
//Autenticação do sistema
app.use(middlewareAuth);


const routes = require('./routes/Rotas');
app.use('/api', routes);

// Rota de teste
app.get('/api', (req, res) => {
    res.send('API a funcionar');
});

app.listen(3000, () => {

});

module.exports = app;
