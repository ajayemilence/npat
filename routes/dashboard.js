//var express = require('express');
var router = express.Router();

var npatService = require('../app/services/npatService');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);



router.get('/', function(req, res) {
    npatService.getwords(req, function(data) {
        //console.log(data);
        res.render('dashboard', { words: data.name, words2 : data.place 
        , words3 : data.animal
        , words4 : data.thing
        , words5 : data.plant , title: 'Words', rootPath: process.env.IMAGES_ROOT_PATH});
    });
});

router.get('/add', function(req, res, next) {
    res.render('partials/addQuote', { layout: false });
});


router.post('/createquote', function(req, res) {
    npatService.createquote(req, function(data) {
        res.redirect('/main');
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

// router.get('/', function(req, res) {
//     res.render('login', { layout: null, title: 'Express' });
// });



 module.exports = router;



