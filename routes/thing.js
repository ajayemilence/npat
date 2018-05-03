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
eachdata.createdAt =  moment(eachdata.createdAt).format("MMMM Do YYYY") //"2013-03-10"
            });
        res.render('thing', { words: data , title: 'Things', rootPath: process.env.IMAGES_ROOT_PATH});
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


 module.exports = router;
