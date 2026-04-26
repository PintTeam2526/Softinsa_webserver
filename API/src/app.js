var createError = require('http-errors');
var express = require('express');
var path = require('path');
var middlewareAuth = require('./middleware/auth.middleware')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//--------------MiddleWares-----------------
//Autenticação do sistema
app.use(middlewareAuth);

const routes = require('./routes/Rotas');
app.use('/api', routes);


app.listen(3000, () => {

});

module.exports = app;
