var express = require('express');
var router = express.Router();
var modeloHomepage = require('../models/Homepage.model');


router.get('/', function(req, res, next) {
    res.send('Estou na pagina inicial')
    //res.json({chave:'valor'});
});


module.exports = router;