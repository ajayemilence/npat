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
eachdata.createdAt =  moment(eachdata.createdAt).format("MMMM Do YYYY") //"2013-03-10"
            });
        res.render('name', { words: data , title: 'Names', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});

router.get('/addname', function(req, res, next) {
    res.render('partials/addName', { layout: false });
});

router.post('/createName', function(req, res) {
    console.log("yaha create name hai ,  ccccccccc");
    npatService.createName(req, function(data) {
        res.redirect('/name');
    });
});

 module.exports = router;



