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
        res.render('place', { words: data , title: 'Places', rootPath: process.env.IMAGES_ROOT_PATH});
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

 module.exports = router;


