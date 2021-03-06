//var express = require('express');
var router = express.Router();
let moment = require('moment');

var npatService = require('../app/services/npatService');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);


router.get('/', function(req, res) {

    npatService.getplants(req, function(data) {
    	var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('plant', { words: data , title: 'Plants by admin', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});

router.get('/game', function(req, res) {

    npatService.getplantsGame(req, function(data) {
        var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('gamePlant', { words: data , title: 'Plants by users', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});



router.get('/addPlant', function(req, res, next) {
    res.render('partials/addPlant', { layout: false });
});


router.post('/createPlant', function(req, res) {
    npatService.createPlant(req, function(data) {
        res.redirect('/plant');
    });
});

// csv===

router.post('/addPlantCsv', function(req, res) {
    npatService.addPlantCsv(req, function(data) {
        res.redirect('/plant');
    });
});

router.get('/addCsv', function(req, res, next) {
    res.render('partials/addNameCsv', { layout: false });
});


 module.exports = router;
