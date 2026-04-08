var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.post('/', function(req, res, next) {

});

router.get('/:id', function(req, res, next) {
    
});

router.put('/:id', function(req, res, next) {

});
//metodo de avaliação do talent manager
router.post('/:id/tm-review', function(req, res, next) {
    
});
//metodo de avaliação do service line
router.pos('/:id/sl-review', function(req, res, next) {
    
});
//metodo para o consultor reenviar o pedido caso seja devolvido
router.pos('/:id/resubmit', function(req, res, next) {
    
});

module.exports = router;