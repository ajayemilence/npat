let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let multer = require('multer');
let passport = require('passport');

let config = require('../config');
let storage = require('../middleware/storage');
let Thing = require('../model/thing');
let Animal = require('../model/animal');
let Human = require('../model/human');
let Place = require('../model/place');
let Plant = require('../model/plant');

let { authenticate, generateAccessToken, respond } = require('../middleware/authMiddleware');

module.exports = ({ config, db }) => {
    let api = express.Router();


    api.get('/getAllWords', (req, res) => {

        data = {};
        Human.find({},
            (err, name) => {
                Animal.find({},
                    (err, animal) => {
                        Thing.find({},
                            (err, thing) => {
                                Place.find({},
                                    (err, place) => {
                                        Plant.find({},
                                            (err, plant) => {
                                                data.name = name;
                                                data.place = place;
                                                data.animal = animal;
                                                data.thing = thing
                                                data.plant = plant
                                                res.json({ success : 1 , data });
                                            });
                                    });
                            });
                    });
            });
    });



    return api;

};