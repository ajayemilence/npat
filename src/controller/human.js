let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let Human = require('../model/human');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // add human ============================>

    // api.post('/addHuman', (req, res) => {
    //     let human = new Human({
    //         name: req.body.name,
    //         word: req.body.word,
    //         type: req.body.type,
    //         gender: req.body.gender,
    //         createdAt: moment().local().valueOf(),
    //         updatedAt: moment().local().valueOf(),
    //         language: req.body.language
    //     });
    //     human.save((error, human) => {
    //         if (error) {
    //             res.json({ success: 0, msg: error });
    //         }

    //         res.status(200).json({ success: 1, msg: 'human info added', data: human });

    //     });
    // });


    api.post('/addHuman', (req, res) => {
        Human.findOne({ name: req.body.name }, (err, human) => {
            if (err) {
                return res.send(err);
            }

            if (human == null || !human) {

               let human = new Human({
                    name: req.body.name,
                    word: req.body.word,
                    type: req.body.type,
                    gender: req.body.gender,
                    createdAt: moment().local().valueOf(),
                    updatedAt: moment().local().valueOf(),
                    language: req.body.language,
                    upVote: (req.body.upVote === undefined) ? 0 : req.body.upVote,
                    downVote: (req.body.downVote === undefined) ? 0 : req.body.downVote
                });
                human.save((error, human) => {
                    if (error) {
                        res.json({ success: 0, msg: error });
                    }

                    res.status(200).json({ success: 1, msg: 'human info added', data: human });

                });
            } else {
                 human.upVote = human.upVote + req.body.upVote;
                human.downVote = human.downVote + req.body.downVote;

                human.save((err, human) => {
                    if (err) {
                        return res.status(201).json({ success: 0, msg: " error occurred while saving the upvote" , Error : err})
                    }
                    return res.status(200).json({ success: 1, msg: " human word info added upvoted", data: human })
                });

                
            }

        });
    });





    api.get('/getAllNames', (req, res) => {
        Human.find({}, (err, names) => {
            if (err) {
                res.json({ success: 0, msg: "error occurred while retriving the names of human" });
            }
            return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names });
        });
    });

    api.put('/updateHuman/:id', (req, res) => {
        Human.findById(req.params.id, (err, human) => {
            if (err) {
                return res.json({ msg: "error occurred in getting the human" })
            }
            human.name = (req.body.name === undefined) ? human.name : req.body.name,
                human.word = (req.body.word === undefined) ? human.word : req.body.word,
                human.type = (req.body.type === undefined) ? human.type : req.body.type,
                human.updatedAt = moment().local().valueOf(),
                human.language = (req.body.language === undefined) ? human.language : req.body.language,

                human.save(err => {
                    if (err) {
                        return res.json({ success: 0, msg: err });
                    }

                    res.status(200).json({ success: 1, msg: 'human info added', data: human });

                });
        });
    });




    api.post('/upVote', (req, res) => {
        Human.findOne({ name: req.body.name }, (err, human) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred while retriving the word" });
            }

            if (human.upVote == undefined || human.upVote == NaN) {
                human.upVote = 0;
            }
            human.upVote = human.upVote + 1;
            human.save((err, human) => {
                if (err) {
                    return res.status(201).json({ success: 0, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 1, msg: "word upvoted", data: human })
            });
        });
    });

    api.post('/downVote', (req, res) => {
        Human.findOne({ name: req.body.name }, (err, human) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (human.downVote == undefined || human.downVote == NaN) {
                human.downVote = 0;
            }
            human.downVote = human.downVote + 1;
            human.save((err, human) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word downVoted", data: human })
            })
        });
    });


    api.delete('/delete/:id', (req, res) => {
        Human.findById(req.params.id, (err, human) => {
            human.remove((err) => {
                if (err) {
                    return res.status(501).json({ success: 0, msg: "something went wrong" })
                }

                res.status(200).json({ success: 1, msg: "human is deleted" });
            });

        });
    });


    // example for npat to show ===============

    api.post('/npat', (req, res) => {
        var active = req.body.alphabet;
        switch (active) {
            case "A":
                var raw = {};
                raw.animalName = "aanimalName";
                raw.humanName = "ahumanName";
                raw.ThingName = "aThingName";
                raw.PlantName = "aPlantName";
                raw.countryName = "acountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "B":
                var raw = {};
                raw.animalName = "banimalName";
                raw.humanName = "bhumanName";
                raw.ThingName = "bThingName";
                raw.PlantName = "bPlantName";
                raw.countryName = "bcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "C":
                var raw = {};
                raw.animalName = "canimalName";
                raw.humanName = "chumanName";
                raw.ThingName = "cThingName";
                raw.PlantName = "cPlantName";
                raw.countryName = "ccountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "D":
                var raw = {};
                raw.animalName = "danimalName";
                raw.humanName = "dhumanName";
                raw.ThingName = "dThingName";
                raw.PlantName = "dPlantName";
                raw.countryName = "dcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "E":
                var raw = {};
                raw.animalName = "eanimalName";
                raw.humanName = "ehumanName";
                raw.ThingName = "eThingName";
                raw.PlantName = "ePlantName";
                raw.countryName = "ecountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "F":
                var raw = {};
                raw.animalName = "fanimalName";
                raw.humanName = "fhumanName";
                raw.ThingName = "fThingName";
                raw.PlantName = "fPlantName";
                raw.countryName = "fcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "G":
                var raw = {};
                raw.animalName = "ganimalName";
                raw.humanName = "ghumanName";
                raw.ThingName = "gThingName";
                raw.PlantName = "gPlantName";
                raw.countryName = "gcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "H":
                var raw = {};
                raw.animalName = "hanimalName";
                raw.humanName = "hhumanName";
                raw.ThingName = "hThingName";
                raw.PlantName = "hPlantName";
                raw.countryName = "hcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "I":
                var raw = {};
                raw.animalName = "ianimalName";
                raw.humanName = "ihumanName";
                raw.ThingName = "iThingName";
                raw.PlantName = "iPlantName";
                raw.countryName = "icountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "J":
                var raw = {};
                raw.animalName = "janimalName";
                raw.humanName = "jhumanName";
                raw.ThingName = "jThingName";
                raw.PlantName = "jPlantName";
                raw.countryName = "jcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "K":
                var raw = {};
                raw.animalName = "kanimalName";
                raw.humanName = "khumanName";
                raw.ThingName = "kThingName";
                raw.PlantName = "kPlantName";
                raw.countryName = "kcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "L":
                var raw = {};
                raw.animalName = "lanimalName";
                raw.humanName = "lhumanName";
                raw.ThingName = "lThingName";
                raw.PlantName = "lPlantName";
                raw.countryName = "lcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "M":
                var raw = {};
                raw.animalName = "manimalName";
                raw.humanName = "mhumanName";
                raw.ThingName = "mThingName";
                raw.PlantName = "mPlantName";
                raw.countryName = "mcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "N":
                var raw = {};
                raw.animalName = "nanimalName";
                raw.humanName = "nhumanName";
                raw.ThingName = "nThingName";
                raw.PlantName = "nPlantName";
                raw.countryName = "ncountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "O":
                var raw = {};
                raw.animalName = "oanimalName";
                raw.humanName = "ohumanName";
                raw.ThingName = "oThingName";
                raw.PlantName = "oPlantName";
                raw.countryName = "ocountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "P":
                var raw = {};
                raw.animalName = "panimalName";
                raw.humanName = "phumanName";
                raw.ThingName = "phingName";
                raw.PlantName = "pPlantName";
                raw.countryName = "pcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "Q":
                var raw = {};
                raw.animalName = "qanimalName";
                raw.humanName = "qhumanName";
                raw.ThingName = "qThingName";
                raw.PlantName = "qPlantName";
                raw.countryName = "qcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "R":
                var raw = {};
                raw.animalName = "ranimalName";
                raw.humanName = "rhumanName";
                raw.ThingName = "rThingName";
                raw.PlantName = "rPlantName";
                raw.countryName = "rcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "S":
                var raw = {};
                raw.animalName = "sanimalName";
                raw.humanName = "shumanName";
                raw.ThingName = "sThingName";
                raw.PlantName = "sPlantName";
                raw.countryName = "scountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "T":
                var raw = {};
                raw.animalName = "tanimalName";
                raw.humanName = "thumanName";
                raw.ThingName = "tThingName";
                raw.PlantName = "tPlantName";
                raw.countryName = "tcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "U":
                var raw = {};
                raw.animalName = "uanimalName";
                raw.humanName = "uhumanName";
                raw.ThingName = "uThingName";
                raw.PlantName = "uPlantName";
                raw.countryName = "ucountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "V":
                var raw = {};
                raw.animalName = "vanimalName";
                raw.humanName = "vhumanName";
                raw.ThingName = "vThingName";
                raw.PlantName = "vPlantName";
                raw.countryName = "vcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "W":
                var raw = {};
                raw.animalName = "wanimalName";
                raw.humanName = "whumanName";
                raw.ThingName = "wThingName";
                raw.PlantName = "wPlantName";
                raw.countryName = "wcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "X":
                var raw = {};
                raw.animalName = "xanimalName";
                raw.humanName = "xhumanName";
                raw.ThingName = "xThingName";
                raw.PlantName = "xPlantName";
                raw.countryName = "xcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "Y":
                var raw = {};
                raw.animalName = "yanimalName";
                raw.humanName = "yhumanName";
                raw.ThingName = "yThingName";
                raw.PlantName = "yPlantName";
                raw.countryName = "ycountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            case "Z":
                var raw = {};
                raw.animalName = "zanimalName";
                raw.humanName = "zhumanName";
                raw.ThingName = "zThingName";
                raw.PlantName = "zPlantName";
                raw.countryName = "zcountryName"
                res.json({
                    success: 1,
                    data: raw
                });
                break;
            default:
                res.json({
                    success: 0,
                    msg: "invalid input"
                });
        }
    });



    return api;
};