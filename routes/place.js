//var express = require('express');
var router = express.Router();
let moment = require('moment');

var npatService = require('../app/services/npatService');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);


router.get('/', function(req, res) {
    npatService.getplaces(req, function(data) {
    	var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('place', { words: data , title: 'Places by admin', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});


router.get('/game', function(req, res) {
    npatService.getplacesGame(req, function(data) {
        var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('gamePlace', { words: data , title: 'Places by users', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});


router.get('/addPlace', function(req, res, next) {
    res.render('partials/addPlace', { layout: false });
});

router.post('/createPlace', function(req, res) {
    npatService.createPlace(req, function(data) {
        res.redirect('/place');
    });
});


// csv===


router.post('/addPlaceCsv', function(req, res) {
    console.log(req , "addPlae hai yah aaaa prrrr");

    npatService.addPlaceCsv(req, function(data) {
        //console.log(data , "dattaaaa");
        res.redirect('/place');
    });
});

router.get('/addCsv', function(req, res, next) {
    res.render('partials/addPlaceCsv', { layout: false });
});


 module.exports = router;


