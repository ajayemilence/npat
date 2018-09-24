let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');
var _ = require('underscore');

let config = require('../config');

let AdminAnimal = require('../model/adminAnimal');
let AdminHuman = require('../model/adminHuman');
let AdminPlace = require('../model/adminPlace');
let AdminPlant = require('../model/adminPlant');
let AdminThing = require('../model/adminThing');
let Hints = require('../model/hints');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // get data ============================>



    api.get('/testing', (req, res) => {
        res.status(200).json({ success: 1, msg: "user is online" });
    });



    api.get('/main', (req, res) => {

        var rightBot;
        var wrongBot;

        var languageWord;

        if (req.query.language == '1') {
            languageWord = "Arabian";
        } else if (req.query.language == '0') {
            languageWord = "English";
        } else {
            return res.json({ success: 0, msg: "Please send launguage code right" });
        }

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

            AdminAnimal.count({ word: req.query.word, language: languageWord }).exec(function(err, count) {
                var random = Math.floor(Math.random() * count)
                AdminAnimal.findOne({ word: req.query.word, language: languageWord }).skip(random).exec(
                    (err, animal) => {
                        AdminHuman.count({ word: req.query.word, language: languageWord }).exec(function(err, counthuman) {
                            var randomHuman = Math.floor(Math.random() * counthuman)
                            AdminHuman.findOne({ word: req.query.word, language: languageWord }).skip(randomHuman).exec(
                                (err, human) => {

                                    AdminPlant.count({ word: req.query.word, language: languageWord }).exec(function(err, countplant) {
                                        var randomplant = Math.floor(Math.random() * countplant)
                                        AdminPlant.findOne({ word: req.query.word, language: languageWord }).skip(randomplant).exec(
                                            (err, plant) => {

                                                AdminThing.count({ word: req.query.word, language: languageWord }).exec(function(err, countthing) {
                                                    var randomthing = Math.floor(Math.random() * countthing)
                                                    AdminThing.findOne({ word: req.query.word, language: languageWord }).skip(randomthing).exec(
                                                        (err, thing) => {

                                                            AdminPlace.count({ word: req.query.word, language: languageWord }).exec(function(err, countplace) {
                                                                var randomplace = Math.floor(Math.random() * countplace)
                                                                AdminPlace.findOne({ word: req.query.word, language: languageWord }).skip(randomplace).exec(
                                                                    (err, place) => {
                                                                        // Tada! random user
                                                                        var data = new Object();
                                                                        if (human == null) {
                                                                            data.humanName = "nullWord";
                                                                        } else {
                                                                            data.humanName = human.name;
                                                                        }
                                                                        if (place == null) {
                                                                            data.placeName = "nullWord";
                                                                        } else {
                                                                            data.placeName = place.name;
                                                                        }
                                                                        if (animal == null) {
                                                                            data.animalName = "nullWord";
                                                                        } else {
                                                                            data.animalName = animal.name;
                                                                        }
                                                                        if (thing == null) {
                                                                            data.thingName = "nullWord";
                                                                        } else {
                                                                            data.thingName = thing.name;
                                                                        }
                                                                        if (plant == null) {
                                                                            data.plantName = "nullWord";
                                                                        } else {
                                                                            data.plantName = plant.name;
                                                                        }

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


            //=================== underscore ==================================
            var rand = Math.floor(Math.random() * npatArr.length);

            _.shuffle(npatArr);


            if (rand == 0) {
                rand = rand + 1

            }


            var showRight = _.sample([1, 2, 3, 4, 5], rand);


            // 1 == name;
            // 2 == place;
            // 3 == animal;
            // 4 == thing;
            // 5 == plant;



            var npatBotArr = ['Name', 'Place', 'Animal', 'Thing', 'Plant'];


            var NpatBotPromises = npatBotArr.map(type => {
                return new Promise((resolve, reject) => {
                    if (type == 'Name') {
                        if (showRight.includes(1)) {

                            AdminHuman.count({ word: req.query.word, language: languageWord })
                                .exec(function(err, count) {
                                    var humanRandom = Math.floor(Math.random() * count)
                                    AdminHuman.findOne({ word: req.query.word, language: languageWord })
                                        .skip(humanRandom).exec(
                                            (err, human) => {
                                                if (human == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = human.name;
                                                }

                                                resolve(botWord)

                                            });
                                });
                        } else {

                            AdminHuman.count({ word: { $ne: req.query.word }, "language": languageWord })
                                .exec(function(err, count) {
                                    var humanRandom = Math.floor(Math.random() * count)
                                    AdminHuman.findOne({ word: { $ne: req.query.word }, "language": languageWord })
                                        .skip(humanRandom).exec(
                                            (err, human) => {

                                                if (human == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = human.name;
                                                }

                                                resolve(botWord)


                                            });
                                });
                        }


                    } else if (type == 'Place') {
                        if (showRight.includes(2)) {
                            AdminPlace.count({ word: req.query.word, "language": languageWord })
                                .exec(function(err, count) {
                                    var placeRandom = Math.floor(Math.random() * count)
                                    AdminPlace.findOne({ word: req.query.word, "language": languageWord })
                                        .skip(placeRandom).exec(
                                            (err, place) => {

                                                if (place == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = place.name;
                                                }

                                                resolve(botWord)

                                            });
                                });
                        } else {
                            AdminPlace.count({ word: { $ne: req.query.word }, "language": languageWord })
                                .exec(function(err, count) {
                                    var placeRandom = Math.floor(Math.random() * count)
                                    AdminPlace.findOne({ word: { $ne: req.query.word }, "language": languageWord })
                                        .skip(placeRandom).exec(
                                            (err, place) => {

                                                if (place == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = place.name;
                                                }

                                                resolve(botWord)

                                            });
                                });
                        }
                    } else if (type == 'Animal') {
                        if (showRight.includes(3)) {
                            AdminAnimal.count({ word: req.query.word, "language": languageWord })
                                .exec(function(err, count) {
                                    var animalRandom = Math.floor(Math.random() * count)
                                    AdminAnimal.findOne({ word: req.query.word, "language": languageWord })
                                        .skip(animalRandom).exec(
                                            (err, animal) => {

                                                if (animal == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = animal.name;
                                                }

                                                resolve(botWord)
                                            });
                                });
                        } else {
                            AdminAnimal.count({ word: { $ne: req.query.word }, "language": languageWord })
                                .exec(function(err, count) {
                                    var animalRandom = Math.floor(Math.random() * count)
                                    AdminAnimal.findOne({ word: { $ne: req.query.word }, "language": languageWord })
                                        .skip(animalRandom).exec(
                                            (err, animal) => {

                                                if (animal == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = animal.name;
                                                }

                                                resolve(botWord)
                                            });
                                });
                        }
                    } else if (type == 'Thing') {
                        if (showRight.includes(4)) {
                            AdminThing.count({ word: req.query.word, "language": languageWord })
                                .exec(function(err, count) {
                                    var animalRandom = Math.floor(Math.random() * count)
                                    AdminThing.findOne({ word: req.query.word, "language": languageWord })
                                        .skip(animalRandom).exec(
                                            (err, thing) => {

                                                if (thing == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = thing.name;
                                                }

                                                resolve(botWord)

                                            });
                                });
                        } else {
                            AdminThing.count({ word: { $ne: req.query.word }, "language": languageWord })
                                .exec(function(err, count) {
                                    var animalRandom = Math.floor(Math.random() * count)
                                    AdminThing.findOne({ word: { $ne: req.query.word }, "language": languageWord })
                                        .skip(animalRandom).exec(
                                            (err, thing) => {

                                                if (thing == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = thing.name;
                                                }

                                                resolve(botWord)

                                            });
                                });
                        }
                    } else {
                        if (showRight.includes(5)) {
                            AdminPlant.count({ word: req.query.word, "language": languageWord })
                                .exec(function(err, count) {
                                    var plantRandom = Math.floor(Math.random() * count)
                                    AdminPlant.findOne({ word: req.query.word, "language": languageWord })
                                        .skip(plantRandom).exec(
                                            (err, plant) => {

                                                if (plant == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = plant.name;
                                                }

                                                resolve(botWord)

                                            });
                                });
                        } else {
                            AdminPlant.count({ word: { $ne: req.query.word }, "language": languageWord })
                                .exec(function(err, count) {
                                    var plantRandom = Math.floor(Math.random() * count)
                                    AdminPlant.findOne({ word: { $ne: req.query.word }, "language": languageWord })
                                        .skip(plantRandom).exec(
                                            (err, plant) => {

                                                if (plant == null) {
                                                    var botWord = "nullWord";
                                                } else {
                                                    var botWord = plant.name;
                                                }
                                                resolve(botWord)

                                            });
                                });
                        }
                    }


                });
            });
            Promise.all(NpatBotPromises).then(botWords => {


                var finalBotWords = Object.assign({
                    humanName: botWords[0],
                    placeName: botWords[1],
                    animalName: botWords[2],
                    thingName: botWords[3],
                    plantName: botWords[4]
                });

                return res.json({ success: 1, msg: 'words shown of given letter', data: finalBotWords });
            }).catch(err => {
                res.json({ success: 0, msg: 'Unable to get field' });
            });

        }


    });




    api.post('/hints/add', (req, res) => {

        let hint = new Hints({
            name: req.body.name,
            type: req.body.type,
            language: req.body.language,
        });
        hint.save((error, hint) => {
            if (error) {
                return res.status(401).json({ success: 0, msg: error });
            }

            res.status(200).json({ success: 1, msg: 'hint info added', data: hint });

        });

    });

    api.get('/hints/get', (req, res) => {
        if (req.query.language == "1") {
            Hints.aggregate([{ $match: { language: "Arabian" } },
                { $sample: { size: 1 } }
            ], (err, hint) => {
                if (err) {
                    return res.status(401).json({ success: 0, msg: "error while retriving the hint" });
                } else if (!hint && hint == undefined && hint == null) {
                    return res.status(404).json({ success: 0, msg: "no hint retrived" });
                } else {
                    return res.status(200).json({ success: 1, msg: "hint retrived", data: hint });
                }
            })
        } else {

            Hints.aggregate([{ $match: { language: "English" } },
                { $sample: { size: 1 } }
            ], (err, hint) => {
                if (err) {
                    return res.status(401).json({ success: 0, msg: "error while retriving the hint" });
                } else if (!hint && hint == undefined && hint == null) {
                    return res.status(404).json({ success: 0, msg: "no hint retrived" });
                } else {
                    return res.status(200).json({ success: 1, msg: "hint retrived", data: hint });
                }
            })
        }

    })









    return api;
};