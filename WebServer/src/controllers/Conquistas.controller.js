var express = require('express');
var router = express.Router();

//Mostrar todas as conquistas
router.get('/show', function(req, res, next) {
     res.send('Mostrar todas as conquistas');
    //res.json({chave:'valor'}); 
});

module.exports = router;