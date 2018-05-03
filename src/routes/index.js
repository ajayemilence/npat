let express = require('express');

let initdb = require('../db');
let config = require('../config');

let account = require('../controller/account');
let human = require('../controller/human');
let animal = require('../controller/animal');
let plant = require('../controller/plant');
let thing = require('../controller/thing');
let place = require('../controller/place');
let main = require('../controller/main');
let admin = require('../controller/admin');

let router = express();

// all URLs and controller files will connect to db 
initdb(db => {
    //api routes v1(v1) we set this up in main file
    router.use('/account', account({ config, db }));
    router.use('/human', human({ config, db }));
    router.use('/animal', animal({ config, db }));
    router.use('/plant', plant({ config, db }));
    router.use('/thing', thing({ config, db }));
    router.use('/place', place({ config, db }));
    router.use('/npat', main({ config, db }));
    router.use('/admin', admin({ config, db }));

 });

	
module.exports = router;