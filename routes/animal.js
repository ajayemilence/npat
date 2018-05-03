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
eachdata.createdAt =  moment(eachdata.createdAt).format("MMM Do YY") //"2013-03-10"
            });
    	//console.log(data2);
        res.render('animal', { words: data , title: 'Animals', rootPath: process.env.IMAGES_ROOT_PATH});
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


 module.exports = router;
