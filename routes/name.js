//var express = require('express');
var router = express.Router();
let moment = require('moment');

var npatService = require('../app/services/npatService');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);



router.get('/', function(req, res) {
    npatService.getnames(req, function(data) {
        var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('name', { words: data , title: 'Names', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});

router.get('/game', function(req, res) {
    npatService.getnamesGame(req, function(data) {
        var data2 = data.forEach((eachdata) => {
eachdata.createdAt =  moment(eachdata.createdAt).format("l") //"2013-03-10"
            });
        res.render('gameName', { words: data , title: 'Names by game', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});


router.get('/addName', function(req, res, next) {
    console.log("yaha pr add name ka hai kya pahuch raha hai");
    res.render('partials/addhuman', { layout: false });
});

router.post('/createName', function(req, res) {
    npatService.createName(req, function(data) {
        res.redirect('/name');
    });
});

 module.exports = router;



