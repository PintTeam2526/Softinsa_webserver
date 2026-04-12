var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.send('Estou na pagina inicial')
    //res.json({chave:'valor'});
});


module.exports = router;