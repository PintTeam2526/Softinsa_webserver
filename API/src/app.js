var createError = require('http-errors');
var express = require('express');
var path = require('path');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/Rotas');
app.use('/api', routes);


app.listen(3000, () => {

});



module.exports = app;
