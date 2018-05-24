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
        switch (req.query.round) {

            case "a":
                var bot1 = Math.random();
                if (bot1 >= 0.5) {

                    Animal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                        var random = Math.floor(Math.random() * count)
                        Animal.findOne({ word: { $ne: req.query.word } }).skip(random).exec(
                            (err, animal) => {
                                Human.count({ word: { $ne: req.query.word } }).exec(function(err, counthuman) {
                                    var randomHuman = Math.floor(Math.random() * counthuman)
                                    Human.findOne({ word: { $ne: req.query.word } }).skip(randomHuman).exec(
                                        (err, human) => {

                                            Plant.count({ word: { $ne: req.query.word } }).exec(function(err, countplant) {
                                                var randomplant = Math.floor(Math.random() * countplant)
                                                Plant.findOne({ word: { $ne: req.query.word } }).skip(randomplant).exec(
                                                    (err, plant) => {

                                                        Thing.count({ word: { $ne: req.query.word } }).exec(function(err, countthing) {
                                                            var randomthing = Math.floor(Math.random() * countthing)
                                                            Thing.findOne({ word: { $ne: req.query.word } }).skip(randomthing).exec(
                                                                (err, thing) => {

                                                                    Place.count({ word: { $ne: req.query.word } }).exec(function(err, countplace) {
                                                                        var randomplace = Math.floor(Math.random() * countplace)
                                                                        Place.findOne({ word: { $ne: req.query.word } }).skip(randomplace).exec(
                                                                            (err, place) => {
                                                                                // Tada! random user
                                                                                var data = new Object();
                                                                                data.animalName = animal.name;
                                                                                data.humanName = human.name;
                                                                                data.thingName = thing.name;
                                                                                data.placeName = place.name;
                                                                                data.plantName = plant.name;
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
                } else {
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
                }
                break;
            case "b":
                var bot2 = Math.random()
                if (bot2 >= 0.6) {

                    Animal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                        var random = Math.floor(Math.random() * count)
                        Animal.findOne({ word: { $ne: req.query.word } }).skip(random).exec(
                            (err, animal) => {
                                Human.count({ word: { $ne: req.query.word } }).exec(function(err, counthuman) {
                                    var randomHuman = Math.floor(Math.random() * counthuman)
                                    Human.findOne({ word: { $ne: req.query.word } }).skip(randomHuman).exec(
                                        (err, human) => {

                                            Plant.count({ word: { $ne: req.query.word } }).exec(function(err, countplant) {
                                                var randomplant = Math.floor(Math.random() * countplant)
                                                Plant.findOne({ word: { $ne: req.query.word } }).skip(randomplant).exec(
                                                    (err, plant) => {

                                                        Thing.count({ word: { $ne: req.query.word } }).exec(function(err, countthing) {
                                                            var randomthing = Math.floor(Math.random() * countthing)
                                                            Thing.findOne({ word: { $ne: req.query.word } }).skip(randomthing).exec(
                                                                (err, thing) => {

                                                                    Place.count({ word: { $ne: req.query.word } }).exec(function(err, countplace) {
                                                                        var randomplace = Math.floor(Math.random() * countplace)
                                                                        Place.findOne({ word: { $ne: req.query.word } }).skip(randomplace).exec(
                                                                            (err, place) => {
                                                                                // Tada! random user
                                                                                var data = new Object();
                                                                                data.animalName = animal.name;
                                                                                data.humanName = human.name;
                                                                                data.thingName = thing.name;
                                                                                data.placeName = place.name;
                                                                                data.plantName = plant.name;
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
                } else {
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
                }
                break;
            case "c":
                var bot3 = Math.random()
                if (bot3 >= 0.7) {
                    Animal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                        var random = Math.floor(Math.random() * count)
                        Animal.findOne({ word: { $ne: req.query.word } }).skip(random).exec(
                            (err, animal) => {
                                Human.count({ word: { $ne: req.query.word } }).exec(function(err, counthuman) {
                                    var randomHuman = Math.floor(Math.random() * counthuman)
                                    Human.findOne({ word: { $ne: req.query.word } }).skip(randomHuman).exec(
                                        (err, human) => {

                                            Plant.count({ word: { $ne: req.query.word } }).exec(function(err, countplant) {
                                                var randomplant = Math.floor(Math.random() * countplant)
                                                Plant.findOne({ word: { $ne: req.query.word } }).skip(randomplant).exec(
                                                    (err, plant) => {

                                                        Thing.count({ word: { $ne: req.query.word } }).exec(function(err, countthing) {
                                                            var randomthing = Math.floor(Math.random() * countthing)
                                                            Thing.findOne({ word: { $ne: req.query.word } }).skip(randomthing).exec(
                                                                (err, thing) => {

                                                                    Place.count({ word: { $ne: req.query.word } }).exec(function(err, countplace) {
                                                                        var randomplace = Math.floor(Math.random() * countplace)
                                                                        Place.findOne({ word: { $ne: req.query.word } }).skip(randomplace).exec(
                                                                            (err, place) => {
                                                                                // Tada! random user
                                                                                var data = new Object();
                                                                                data.animalName = animal.name;
                                                                                data.humanName = human.name;
                                                                                data.thingName = thing.name;
                                                                                data.placeName = place.name;
                                                                                data.plantName = plant.name;
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
                } else {
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
                }
                break;
            case "d":
                var bot4 = Math.random()
                if (bot4 >= 0.8) {
                    Animal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                        var random = Math.floor(Math.random() * count)
                        Animal.findOne({ word: { $ne: req.query.word } }).skip(random).exec(
                            (err, animal) => {
                                Human.count({ word: { $ne: req.query.word } }).exec(function(err, counthuman) {
                                    var randomHuman = Math.floor(Math.random() * counthuman)
                                    Human.findOne({ word: { $ne: req.query.word } }).skip(randomHuman).exec(
                                        (err, human) => {

                                            Plant.count({ word: { $ne: req.query.word } }).exec(function(err, countplant) {
                                                var randomplant = Math.floor(Math.random() * countplant)
                                                Plant.findOne({ word: { $ne: req.query.word } }).skip(randomplant).exec(
                                                    (err, plant) => {

                                                        Thing.count({ word: { $ne: req.query.word } }).exec(function(err, countthing) {
                                                            var randomthing = Math.floor(Math.random() * countthing)
                                                            Thing.findOne({ word: { $ne: req.query.word } }).skip(randomthing).exec(
                                                                (err, thing) => {

                                                                    Place.count({ word: { $ne: req.query.word } }).exec(function(err, countplace) {
                                                                        var randomplace = Math.floor(Math.random() * countplace)
                                                                        Place.findOne({ word: { $ne: req.query.word } }).skip(randomplace).exec(
                                                                            (err, place) => {
                                                                                // Tada! random user
                                                                                var data = new Object();
                                                                                data.animalName = animal.name;
                                                                                data.humanName = human.name;
                                                                                data.thingName = thing.name;
                                                                                data.placeName = place.name;
                                                                                data.plantName = plant.name;
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
                } else {
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
                }
                break;
            case "e":
                var bot5 = Math.random();
                if (bot5 >= 0.9) {

                    Animal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                        var random = Math.floor(Math.random() * count)
                        Animal.findOne({ word: { $ne: req.query.word } }).skip(random).exec(
                            (err, animal) => {
                                Human.count({ word: { $ne: req.query.word } }).exec(function(err, counthuman) {
                                    var randomHuman = Math.floor(Math.random() * counthuman)
                                    Human.findOne({ word: { $ne: req.query.word } }).skip(randomHuman).exec(
                                        (err, human) => {

                                            Plant.count({ word: { $ne: req.query.word } }).exec(function(err, countplant) {
                                                var randomplant = Math.floor(Math.random() * countplant)
                                                Plant.findOne({ word: { $ne: req.query.word } }).skip(randomplant).exec(
                                                    (err, plant) => {

                                                        Thing.count({ word: { $ne: req.query.word } }).exec(function(err, countthing) {
                                                            var randomthing = Math.floor(Math.random() * countthing)
                                                            Thing.findOne({ word: { $ne: req.query.word } }).skip(randomthing).exec(
                                                                (err, thing) => {

                                                                    Place.count({ word: { $ne: req.query.word } }).exec(function(err, countplace) {
                                                                        var randomplace = Math.floor(Math.random() * countplace)
                                                                        Place.findOne({ word: { $ne: req.query.word } }).skip(randomplace).exec(
                                                                            (err, place) => {
                                                                                // Tada! random user
                                                                                var data = new Object();
                                                                                data.animalName = animal.name;
                                                                                data.humanName = human.name;
                                                                                data.thingName = thing.name;
                                                                                data.placeName = place.name;
                                                                                data.plantName = plant.name;
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
                } else {
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
                }

                //res.status(200).json({ success: 1, msg: 'words shown of given letter 5', data: data });
                break;

            default:
                res.status(200).json({ success: 1, msg: 'Please send the round ex : a , b' });
        }


        // Animal.count({ word: req.query.word }).exec(function(err, count) {
        //     var random = Math.floor(Math.random() * count)
        //     Animal.findOne({ word: req.query.word }).skip(random).exec(
        //         (err, animal) => {
        //             Human.count({ word: req.query.word }).exec(function(err, counthuman) {
        //                 var randomHuman = Math.floor(Math.random() * counthuman)
        //                 Human.findOne({ word: req.query.word }).skip(randomHuman).exec(
        //                     (err, human) => {

        //                         Plant.count({ word: req.query.word }).exec(function(err, countplant) {
        //                             var randomplant = Math.floor(Math.random() * countplant)
        //                             Plant.findOne({ word: req.query.word }).skip(randomplant).exec(
        //                                 (err, plant) => {

        //                                     Thing.count({ word: req.query.word }).exec(function(err, countthing) {
        //                                         var randomthing = Math.floor(Math.random() * countthing)
        //                                         Thing.findOne({ word: req.query.word }).skip(randomthing).exec(
        //                                             (err, thing) => {

        //                                                 Place.count({ word: req.query.word }).exec(function(err, countplace) {
        //                                                     var randomplace = Math.floor(Math.random() * countplace)
        //                                                     Place.findOne({ word: req.query.word }).skip(randomplace).exec(
        //                                                         (err, place) => {
        //                                                             // Tada! random user
        //                                                             var data = new Object();
        //                                                             data.animalName = animal.name;
        //                                                             data.humanName = human.name;
        //                                                             data.thingName = thing.name;
        //                                                             data.placeName = place.name;
        //                                                             data.plantName = plant.name;

        //                                                             // res.json(data);
        //                                                             res.status(200).json({ success: 1, msg: 'words shown of given letter', data: data });
        //                                                         });
        //                                                 });
        //                                             });
        //                                     });
        //                                 });
        //                         });
        //                     });
        //             });
        //         });
        // });
    });




    return api;
};