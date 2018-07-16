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


module.exports = ({ config, db }) => {
    let api = express.Router();


    // get data ============================>



    api.get('/testing', (req, res) => {
        res.status(200).json({ success: 1, msg: "user is online" });
    });



    api.get('/main', (req, res) => {

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


            AdminAnimal.count({ word: req.query.word }).exec(function(err, count) {
                var random = Math.floor(Math.random() * count)
                AdminAnimal.findOne({ word: req.query.word }).skip(random).exec(
                    (err, animal) => {
                        AdminHuman.count({ word: req.query.word }).exec(function(err, counthuman) {
                            var randomHuman = Math.floor(Math.random() * counthuman)
                            AdminHuman.findOne({ word: req.query.word }).skip(randomHuman).exec(
                                (err, human) => {

                                    AdminPlant.count({ word: req.query.word }).exec(function(err, countplant) {
                                        var randomplant = Math.floor(Math.random() * countplant)
                                        AdminPlant.findOne({ word: req.query.word }).skip(randomplant).exec(
                                            (err, plant) => {

                                                AdminThing.count({ word: req.query.word }).exec(function(err, countthing) {
                                                    var randomthing = Math.floor(Math.random() * countthing)
                                                    AdminThing.findOne({ word: req.query.word }).skip(randomthing).exec(
                                                        (err, thing) => {

                                                            AdminPlace.count({ word: req.query.word }).exec(function(err, countplace) {
                                                                var randomplace = Math.floor(Math.random() * countplace)
                                                                AdminPlace.findOne({ word: req.query.word }).skip(randomplace).exec(
                                                                    (err, place) => {
                                                                        // Tada! random user
                                                                        var data = new Object();
                                                                        
                                                                        data.humanName = human.name;
                                                                        data.placeName = place.name;
                                                                        data.animalName = animal.name;
                                                                        data.thingName = thing.name;
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


            // 1 == name;
            // 2 == place;
            // 3 == animal;
            // 4 == thing;
            // 5 == plant;


var npatBotArr = ['Name', 'Place', 'Animal', 'Thing' , 'Plant' ];


            var NpatBotPromises = npatBotArr.map(type => {
                return new Promise((resolve, reject) => {
                    if (type == 'Name') {
                        if (showRight.includes(1)) {

                AdminHuman.count({ word: req.query.word }).exec(function(err, count) {
                    var humanRandom = Math.floor(Math.random() * count)
                    AdminHuman.findOne({ word: req.query.word }).skip(humanRandom).exec(
                        (err, human) => {
                            var botWord = human.name;
                            resolve(botWord)

                        });
                });
            } else {

                AdminHuman.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                    var humanRandom = Math.floor(Math.random() * count)
                    AdminHuman.findOne({ word: { $ne: req.query.word } }).skip(humanRandom).exec(
                        (err, human) => {

                             var botWord = human.name;
                            resolve(botWord)


                        });
                });
            }


                    }
                     else if (type == 'Place') {
                    if (showRight.includes(2)) {
                AdminPlace.count({ word: req.query.word }).exec(function(err, count) {
                    var placeRandom = Math.floor(Math.random() * count)
                    AdminPlace.findOne({ word: req.query.word }).skip(placeRandom).exec(
                        (err, place) => {

                            var botWord = place.name;
                            resolve(botWord)

                        });
                });
            } else {
                AdminPlace.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                    var placeRandom = Math.floor(Math.random() * count)
                    AdminPlace.findOne({ word: { $ne: req.query.word } }).skip(placeRandom).exec(
                        (err, place) => {

                            var botWord = place.name;
                            resolve(botWord)

                        });
                });
            }
            }
            else if (type == 'Animal') {
                if (showRight.includes(3)) {
                AdminAnimal.count({ word: req.query.word }).exec(function(err, count) {
                    var animalRandom = Math.floor(Math.random() * count)
                    AdminAnimal.findOne({ word: req.query.word }).skip(animalRandom).exec(
                        (err, animal) => {

                            var botWord = animal.name;
                            resolve(botWord)
                        });
                });
            } else {
                AdminAnimal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                    var animalRandom = Math.floor(Math.random() * count)
                    AdminAnimal.findOne({ word: { $ne: req.query.word } }).skip(animalRandom).exec(
                        (err, animal) => {

                            var botWord = animal.name;
                            resolve(botWord)
                        });
                });
            }
            }
            else if (type == 'Thing') {
                if (showRight.includes(4)) {
                AdminThing.count({ word: req.query.word }).exec(function(err, count) {
                    var animalRandom = Math.floor(Math.random() * count)
                    AdminThing.findOne({ word: req.query.word }).skip(animalRandom).exec(
                        (err, thing) => {

                            var botWord = thing.name;
                            resolve(botWord)

                        });
                });
            } else {
                AdminThing.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                    var animalRandom = Math.floor(Math.random() * count)
                    AdminThing.findOne({ word: { $ne: req.query.word } }).skip(animalRandom).exec(
                        (err, thing) => {

                           var botWord = thing.name;
                            resolve(botWord)

                        });
                });
            }
            }
            else{
                if (showRight.includes(5)) {
                AdminPlant.count({ word: req.query.word }).exec(function(err, count) {
                    var plantRandom = Math.floor(Math.random() * count)
                    AdminPlant.findOne({ word: req.query.word }).skip(plantRandom).exec(
                        (err, plant) => {

                            var botWord = plant.name;
                            resolve(botWord)

                        });
                });
                //console.log("Animal");
            } else {
                AdminPlant.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
                    var plantRandom = Math.floor(Math.random() * count)
                    AdminPlant.findOne({ word: { $ne: req.query.word } }).skip(plantRandom).exec(
                        (err, plant) => {

                            var botWord = plant.name;
                            resolve(botWord)

                        });
                });
            }
            }


                });
            });
// Promise.all(cropPromises).then(crops => {
Promise.all(NpatBotPromises).then(botWords =>{

    // botWords.map(words => {

    // })

    // var finalBotWords = Object.assign({animalName : botWords[2] ,
    //  humanName : botWords[0],
    //   thingName : botWords[3] , 
    //   placeName : botWords[1], 
    //   plantName : botWords[4]}); 

    var finalBotWords = Object.assign({humanName : botWords[0] ,
     placeName : botWords[1],
      animalName : botWords[2] , 
      thingName : botWords[3], 
      plantName : botWords[4]}); 

                     return res.json({success: 1, msg: 'wrong words shown of given letter', data: finalBotWords});
                }).catch(err => {
                    res.json({success: 0, msg:'Unable to get field'});
                });


// {
//     "success": 1,
//     "msg": "words shown of given letter",
//     "data": {
//         "animalName": "Parot",
//         "humanName": "Puneet2",
//         "thingName": "Pencil",
//         "placeName": "Palce",
//         "plantName": "Pea"
//     }
// }

        //     var myPromiseName =  new Promise((resolve, reject) => {
        //     if (showRight.includes(1)) {

        //         Human.count({ word: req.query.word }).exec(function(err, count) {
        //             var humanRandom = Math.floor(Math.random() * count)
        //             Human.findOne({ word: req.query.word }).skip(humanRandom).exec(
        //                 (err, human) => {

        //                     resolve(human)

        //                 });
        //         });
        //     } else {

        //         Human.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
        //             var humanRandom = Math.floor(Math.random() * count)
        //             Human.findOne({ word: { $ne: req.query.word } }).skip(humanRandom).exec(
        //                 (err, human) => {

        //                      resolve(human)


        //                 });
        //         });
        //     }
        // });

        //     var myPromisePlace =  new Promise((resolve, reject) => {
        //     if (showRight.includes(2)) {
        //         Place.count({ word: req.query.word }).exec(function(err, count) {
        //             var placeRandom = Math.floor(Math.random() * count)
        //             Place.findOne({ word: req.query.word }).skip(placeRandom).exec(
        //                 (err, place) => {

        //                     resolve(place)

        //                 });
        //         });
        //     } else {
        //         Place.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
        //             var placeRandom = Math.floor(Math.random() * count)
        //             Place.findOne({ word: { $ne: req.query.word } }).skip(placeRandom).exec(
        //                 (err, place) => {
        //                     resolve(place);

        //                 });
        //         });
        //     }
        // });


        //     var myPromiseAnimal =  new Promise((resolve, reject) => {
        //     if (showRight.includes(3)) {
        //         Animal.count({ word: req.query.word }).exec(function(err, count) {
        //             var animalRandom = Math.floor(Math.random() * count)
        //             Animal.findOne({ word: req.query.word }).skip(animalRandom).exec(
        //                 (err, animal) => {

        //                     resolve(animal);
        //                 });
        //         });
        //     } else {
        //         Animal.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
        //             var animalRandom = Math.floor(Math.random() * count)
        //             Animal.findOne({ word: { $ne: req.query.word } }).skip(animalRandom).exec(
        //                 (err, animal) => {

        //                     resolve(animal);
        //                 });
        //         });
        //     }
        // });

        //     var myPromiseThing =  new Promise((resolve, reject) => {
        //     if (showRight.includes(4)) {
        //         Thing.count({ word: req.query.word }).exec(function(err, count) {
        //             var animalRandom = Math.floor(Math.random() * count)
        //             Thing.findOne({ word: req.query.word }).skip(animalRandom).exec(
        //                 (err, thing) => {

        //                     resolve(thing);

        //                 });
        //         });
        //     } else {
        //         Thing.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
        //             var animalRandom = Math.floor(Math.random() * count)
        //             Thing.findOne({ word: { $ne: req.query.word } }).skip(animalRandom).exec(
        //                 (err, thing) => {

        //                     resolve(thing);

        //                 });
        //         });
        //     }
        // });

        //     var myPromisePlant =  new Promise((resolve, reject) => {
        //     if (showRight.includes(5)) {
        //         Plant.count({ word: req.query.word }).exec(function(err, count) {
        //             var plantRandom = Math.floor(Math.random() * count)
        //             Plant.findOne({ word: req.query.word }).skip(plantRandom).exec(
        //                 (err, plant) => {

        //                     resolve(plant);

        //                 });
        //         });
        //         //console.log("Animal");
        //     } else {
        //         Plant.count({ word: { $ne: req.query.word } }).exec(function(err, count) {
        //             var plantRandom = Math.floor(Math.random() * count)
        //             Plant.findOne({ word: { $ne: req.query.word } }).skip(plantRandom).exec(
        //                 (err, plant) => {

        //                     resolve(plant);

        //                 });
        //         });
        //     }
        // });


                //     var npatbotWrong = {};
                //  myPromiseName.then(name =>{
                //      npatbotWrong.humanName = name.name;
                //  });
                //   myPromiseAnimal.then(animal =>{
                //      npatbotWrong.animalName = animal.name;
                //  });
                //    myPromisePlace.then(place =>{
                //      npatbotWrong.placeName = place.name;
                //  });
                //     myPromiseThing.then(thing =>{
                //         console.log(thing);
                //      npatbotWrong.thingName = thing.name;
                //  });
                //      myPromisePlant.then(plant =>{
                //      npatbotWrong.plantName = plant.name;

                //      return res.json({success: 1, msg: 'wrong words shown of given letter', data: npatbotWrong});
                // }).catch(err => {
                //     res.json({success: 0, msg:'Unable to get field'});
                // });


//==================================khtam ====================



        }


    });


    



    return api;
};