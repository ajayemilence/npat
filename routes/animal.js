//var express = require('express');
var router = express.Router();
let moment = require('moment');

var npatService = require('../app/services/npatService');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);


router.get('/', function(req, res) {

    npatService.getanimals(req, function(data) {
    	//console.log(data);
    	var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
    	//console.log(data2);
        res.render('animal', { words: data , title: 'Animals by admin', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});


router.get('/game', function(req, res) {

    npatService.getanimalsGame(req, function(data) {
        //console.log(data);
        var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        //console.log(data2);
        res.render('gameAnimal', { words: data , title: 'Animals by users', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});



router.get('/addAnimal', function(req, res, next) {
    res.render('partials/addAnimal', { layout: false });
});

router.post('/createAnimal', function(req, res) {
    npatService.createAnimal(req, function(data) {
        res.redirect('/animal');
    });
});

// csv===

router.post('/addAnimalCsv', function(req, res) {
    npatService.addAnimalCsv(req, function(data) {
        res.redirect('/animal');
    });
});

router.get('/addCsv', function(req, res, next) {
    res.render('partials/addAnimalCsv', { layout: false });
});


 module.exports = router;
