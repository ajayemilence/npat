let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');
var _ = require('underscore');

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

            case "A":
                var bot1 = Math.random();
                if (bot1 >= 0.5) {
                    console.log("false");

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

                    console.log("true");
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
            case "B":
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
            case "C":
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
            case "D":
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
            case "E":
                var bot5 = Math.random();
                if (bot5 >= 0.9) {

                    console.log("true");

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

                    console.log("false");
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
                return res.status(200).json({ success: 1, msg: 'Please send the round ex : A , B' });
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


    api.get('/testing', (req, res) => {
        res.status(200).json({ success: 1, msg: "user is online" });
    });




    api.get('/main2', (req, res) => {

        var rightBot;
        var wrongBot;

        switch (req.query.round) {

            case "A":
                var bot1 = Math.random();
                if (bot1 <= 0.2) {
                    rightBot = 1
                    wrongBot = 0
                } else {
                    rightBot = 0;
                    wrongBot = 1;
                }

                break;

            case "B":
                var bot1 = Math.random();
                if (bot1 <= 0.4) {
                    rightBot = 1
                    wrongBot = 0
                } else {
                    rightBot = 0;
                    wrongBot = 1;
                }

                break;

            case "C":
                var bot1 = Math.random();
                if (bot1 <= 0.6) {
                    rightBot = 1
                    wrongBot = 0
                } else {
                    rightBot = 0;
                    wrongBot = 1;
                }

                break;

            case "D":
                var bot1 = Math.random();
                if (bot1 <= 0.8) {
                    rightBot = 1
                    wrongBot = 0
                } else {
                    rightBot = 0;
                    wrongBot = 1;
                }

                break;

            case "E":
                var bot1 = Math.random();
                if (bot1 <= 0.9) {
                    rightBot = 1
                    wrongBot = 0
                } else {
                    rightBot = 0;
                    wrongBot = 1;
                }

                break;


            default:
                return res.status(201).json({ success: 0, msg: 'Please send the round ex : A , B' });

        }

        if (rightBot == 1) {


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

        } else {

            var npatArr = ['Name', 'Place', 'Animal', 'Plant', 'Thing'];
            var rand = Math.floor(Math.random() * npatArr.length);


            //====================
            function shuffle(array) {
                var currentIndex = array.length,
                    temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

            // Used like so

            //npatArr = shuffle(npatArr);

            //console.log(npatArr);

            //=================== underscore ==================================
            var rand = Math.floor(Math.random() * npatArr.length);

            _.shuffle(npatArr);


            if (rand == 0) {
                rand = rand + 1

            }


            var showRight = _.sample([1, 2, 3, 4, 5], rand);

            //console.log(showRight);

            // 1 == name;
            // 2 == place;
            // 3 == animal;
            // 4 == thing;
            // 5 == plant;

            // var n = showRight.includes("Mango");

            // var possible = {};

            //var promiseWrong = /*new promiseWrong{}*/

            var asehi = {};
                var myPromise =  new Promise((resolve, reject) => {
                    if (showRight.includes(1)) {


                        Human.count({ word: req.query.word }).exec(function(err, count) {
                            var humanRandom = Math.floor(Math.random() * count)
                            Human.findOne({ word: req.query.word }).skip(humanRandom).exec(
                                (err, human) => {

                                    //rightHuman = human;
                                    //asehi.name = human.name;
                                    resolve(human)

                                    //console.log(possible);

                                });
                        });
                    } else {

                        Human.count({ word: req.query.word }).exec(function(err, count) {
                            var humanRandom = Math.floor(Math.random() * count)
                            Place.findOne({ word: { $ne: req.query.word } }).skip(humanRandom).exec(
                                (err, human) => {

                                    wrongHuman = human;
                                    resolve(human)


                                });
                        });
                    }
                    if (showRight.includes(2)) {
                        Place.count({ word: req.query.word }).exec(function(err, count) {
                            var placeRandom = Math.floor(Math.random() * count)
                            Place.findOne({ word: req.query.word }).skip(placeRandom).exec(
                                (err, place) => {

                                    rightPlace = place;
                                    //resolve(place)

                                    //console.log(possible);

                                });
                        });
                    } else {
                        Place.count({ word: req.query.word }).exec(function(err, count) {
                            var placeRandom = Math.floor(Math.random() * count)
                            Place.findOne({ word: { $ne: req.query.word } }).skip(placeRandom).exec(
                                (err, place) => {

                                   // resolve(place);
                                    wrongPlace = place;


                                });
                        });
                    }
                    if (showRight.includes(3)) {
                        Animal.count({ word: req.query.word }).exec(function(err, count) {
                            var animalRandom = Math.floor(Math.random() * count)
                            Animal.findOne({ word: req.query.word }).skip(animalRandom).exec(
                                (err, animal) => {

                                    rightAnimal = animal;

                                    //console.log(possible);

                                });
                        });
                        //console.log("Animal");
                    } else {
                        Animal.count({ word: req.query.word }).exec(function(err, count) {
                            var animalRandom = Math.floor(Math.random() * count)
                            Animal.findOne({ word: { $ne: req.query.word } }).skip(animalRandom).exec(
                                (err, animal) => {

                                    wrongAnimal = animal;

                                    //console.log(possible);

                                });
                        });
                        //console.log("notAnimal");
                    }
                    if (showRight.includes(4)) {
                        Thing.count({ word: req.query.word }).exec(function(err, count) {
                            var animalRandom = Math.floor(Math.random() * count)
                            Thing.findOne({ word: req.query.word }).skip(animalRandom).exec(
                                (err, thing) => {

                                    rightThing = thing;

                                    //console.log(possible);

                                });
                        });
                        //console.log("Animal");
                    } else {
                        Thing.count({ word: req.query.word }).exec(function(err, count) {
                            var animalRandom = Math.floor(Math.random() * count)
                            Thing.findOne({ word: { $ne: req.query.word } }).skip(animalRandom).exec(
                                (err, thing) => {

                                    wrongThing = thing;

                                    //console.log(possible);

                                });
                        });
                    }
                    if (showRight.includes(5)) {
                        Plant.count({ word: req.query.word }).exec(function(err, count) {
                            var plantRandom = Math.floor(Math.random() * count)
                            Plant.findOne({ word: req.query.word }).skip(plantRandom).exec(
                                (err, plant) => {

                                    rightPlant = plant;

                                    //console.log(possible);

                                });
                        });
                        //console.log("Animal");
                    } else {
                        Plant.count({ word: req.query.word }).exec(function(err, count) {
                            var plantRandom = Math.floor(Math.random() * count)
                            Plant.findOne({ word: { $ne: req.query.word } }).skip(plantRandom).exec(
                                (err, plant) => {

                                    wrongPlant = plant;

                                    //console.log(possible);

                                });
                        });
                    }

                });

            //});
            console.log(asehi);
            Promise.all(myPromise).then(wrongBot => {
                console.log(myPromise)

                //return res.status(200).json({ success: 1, msg: "wrong bot data", data: wrongBot });
            }).catch(err => {
                return res.json({ success: 0, msg: "Error Occured!", error: err });
            });


            //===========================











              return res.json({ success: 1, msg: "wrong bot vala code hogga yaha prrr" });


        }


    });


    api.get('/main3', (req, res) => {
        switch (req.query.round) {

            case "A":
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
            case "B":
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
            case "C":
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
            case "D":
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
            case "E":
                var bot5 = Math.random();
                if (bot5 >= 0.9) {

                    console.log("true");

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

                    console.log("false");
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
                return res.status(200).json({ success: 1, msg: 'Please send the round ex : A , B' });
        }

    });













    return api;
};