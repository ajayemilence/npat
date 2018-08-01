//var express = require('express');
var router = express.Router();
let moment = require('moment');

var npatService = require('../app/services/npatService');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);


router.get('/', function(req, res) {

    npatService.getthings(req, function(data) {
    	var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('thing', { words: data , title: 'Things by admin', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});

router.get('/game', function(req, res) {

    npatService.getthingsGame(req, function(data) {
        var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('gameThing', { words: data , title: 'Things by users', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});


router.get('/addThing', function(req, res, next) {
    res.render('partials/addThing', { layout: false });
});

router.post('/createThing', function(req, res) {
    npatService.createThing(req, function(data) {
        res.redirect('/thing');
    });
});

// csv===

router.post('/addThingCsv', function(req, res) {
    npatService.addThingCsv(req, function(data) {
        res.redirect('/thing');
    });
});

router.get('/addCsv', function(req, res, next) {
    res.render('partials/addThingCsv', { layout: false });
});


 module.exports = router;
