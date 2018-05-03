let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');

let Place = require('../model/place');
let Animal = require('../model/animal');
let Plant = require('../model/plant');
let Thing = require('../model/thing');
let Human = require('../model/human');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // get data ============================>

    api.get('/main', (req, res) => {
        Animal.count({ word: req.query.word }).exec(function(err, count) {
            var random = Math.floor(Math.random() * count)
            Animal.findOne({ word: req.query.word }).skip(random).exec(
                (err, animal) => {

                    Human.count({ word: req.query.word }).exec(function(err, counthuman) {
                        var randomHuman = Math.floor(Math.random() * counthuman)
                        Human.findOne({ word: req.query.word }).skip(randomHuman).exec(
                            (err, human) => {

                                Plant.count({ word: req.query.word }).exec(function(err, countplant) {
                                    var randomplant = Math.floor(Math.random() * countplant)
                                    Plant.findOne({ word: req.query.word }).skip(randomplant).exec(
                                        (err, plant) => {

                                            Thing.count({ word: req.query.word }).exec(function(err, countthing) {
                                                var randomthing = Math.floor(Math.random() * countthing)
                                                Thing.findOne({ word: req.query.word }).skip(randomthing).exec(
                                                    (err, thing) => {

                                                        Place.count({ word: req.query.word }).exec(function(err, countplace) {
                                                            var randomplace = Math.floor(Math.random() * countplace)
                                                            Place.findOne({ word: req.query.word }).skip(randomplace).exec(
                                                                (err, place) => {
                                                                    // Tada! random user
                                                                    var data = new Object();
                                                                    data.animalName = animal.name;
                                                                    data.humanName = human.name;
                                                                    data.thingName = thing.name;
                                                                    data.placeName = place.name;
                                                                    data.plantName = plant.name;

                                                                    // res.json(data);
                                                                    res.status(200).json({ success: 1, msg: 'words shown of given letter', data: data });
                                                                });
                                                        });
                                                    });
                                            });
                                        });
                                });
                            });
                    });
                });
        });
    });




    return api;
};