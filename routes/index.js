//var express = require('express');
var router = express.Router();

var login = require('./login');
var dashboard = require('./dashboard');
var name = require('./name');
var place = require('./place');
var animal = require('./animal');
var thing = require('./thing');
var plant = require('./plant');


router.use('/', login);
router.use('/dashboard', dashboard);
router.use('/name', name);
router.use('/animal', animal);
router.use('/place', place);
router.use('/thing', thing);
router.use('/plant', plant);


router.get('/401', function (req, res) {+
    res.render('401', { layout: null });
});

module.exports = router;