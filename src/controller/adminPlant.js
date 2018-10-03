let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let adminPlant = require('../model/adminPlant');

let storage = require('../middleware/storage');

var session = require('express-session');
var flash = require('connect-flash');
var csv = require("fast-csv");
var fs = require('fs');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // add plant ============================>

    api.post('/addPlant', (req, res) => {
        var name = req.body.name.toLowerCase();
        adminPlant.findOne({ name: name }, (err, plant) => {
            if (err) {
                return res.send(err);
            }

            if (plant == null || !plant) {
                let plant = new adminPlant({
                    name: req.body.name,
                    word: req.body.word,
                    type: req.body.type,
                    createdBy: (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
                    createdAt: moment().local().valueOf(),
                    updatedAt: moment().local().valueOf(),
                    language: req.body.language,
                    upVote: (req.body.upVote === undefined) ? 0 : req.body.upVote,
                    downVote: (req.body.downVote === undefined) ? 0 : req.body.downVote

                });
                plant.save((error, plant) => {
                    if (error) {
                        res.json({ success: 0, msg: error });
                    }

                    res.status(200).json({ success: 1, msg: 'plant info added', data: plant });

                });
            } else {
                plant.upVote = plant.upVote + req.body.upVote;
                plant.downVote = plant.downVote + req.body.downVote;

                plant.save((err, plant) => {
                    if (err) {
                        return res.status(201).json({ success: 0, msg: " error occurred while saving the upvote", Error: err })
                    }
                    return res.status(200).json({ success: 1, msg: " plant word info added upvoted", data: plant })
                });


            }
        });
    });

    //==============csv file uplodation ==========================


    api.post('/csvsample', (req, res) => {

        let upload = multer({ storage: storage }).single('csvFile');
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ success: 0, msg: "error in uploading", error: err });
            }

            var csvFileName = req.file.filename;

            fs.createReadStream('/root/npatAPI/src/uploads/' + csvFileName)
                .pipe(csv())
                .on('data', function(data) {
                    adminPlant.findOne({ name: data[1] }, (err, word) => {
                        if (word) {
                            console.log("already a word in place")
                        } else {
                            // body...
                            let plant = new adminPlant({
                                word: data[0],
                                name: data[1],
                                createdBy: (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
                                createdAt: moment().local().valueOf(),
                                updatedAt: moment().local().valueOf(),
                                language: data[2],
                                upVote: (req.body.upVote === undefined) ? 0 : req.body.upVote,
                                downVote: (req.body.downVote === undefined) ? 0 : req.body.downVote
                            });
                            plant.save((error, plant) => {
                                if (error) {
                                    res.json({ success: 0, msg: error });
                                }
                            });
                        }
                    });
                    //===
                    console.log(data[2], "11111111111111");
                })
                .on('end', function(data) {
                    res.json({ success: 1, msg: "csv file uploaded" });
                    console.log('read finished');
                })

        });
    });

    //===========================================


    api.get('/getAllplants', (req, res) => {
        if(req.query.type == undefined || req.query.type == null || req.query.type == "" || req.query.type == 0){
            languageType = "English";
        }
        else {
            languageType = "Arabian";
        }
        adminPlant.count({language: languageType }, (err, plantCount) => {

            var limit = 20;
            console.log(plantCount);
            var pages = Math.ceil(plantCount / limit);
            if (req.query.pageNumber == undefined ||
                req.query.pageNumber == null ||
                req.query.pageNumber == "" ||
                req.query.pageNumber == 1) {
                skipCount = 0;
            } else {
                skipCount = (req.query.pageNumber - 1) * limit
            }
            adminPlant.find({language: languageType }).sort({ name: +1 }).collation( { locale: 'en', strength: 2 } ).limit(limit)
                .skip(skipCount).exec((err, names) => {
                    if (err) {
                        return res.json({ success: 0, msg: "error occurred while retriving the names of human" });
                    }
                    return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names, numPages: pages });
                });
        });
    });





    api.put('/updateplant/:id', (req, res) => {
        adminPlant.findById(req.params.id, (err, plant) => {
            if (err) {
                return res.json({ msg: "error occurred in getting the plant" })
            }
            plant.name = (req.body.name === undefined) ? plant.name : req.body.name,
                plant.word = (req.body.word === undefined) ? plant.word : req.body.word,
                plant.type = (req.body.type === undefined) ? plant.type : req.body.type,
                plant.updatedAt = moment().local().valueOf(),
                plant.language = (req.body.language === undefined) ? plant.language : req.body.language,

                plant.save(err => {
                    if (err) {
                        return res.json({ success: 0, msg: err });
                    }

                    res.status(200).json({ success: 1, msg: 'plant info added', data: plant });

                });
        });
    });


    api.post('/upVote', (req, res) => {
        adminPlant.findOne({ name: req.body.name }, (err, plant) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (plant.upVote == undefined || plant.upVote == NaN) {
                plant.upVote = 0;
            }
            plant.upVote = plant.upVote + 1;
            plant.save((err, plant) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word upvoted", data: plant })
            })
        });
    });

    api.post('/downVote', (req, res) => {
        adminPlant.findOne({ name: req.body.name }, (err, plant) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (plant.downVote == undefined || plant.downVote == NaN) {
                plant.downVote = 0;
            }
            plant.downVote = plant.downVote + 1;
            plant.save((err, plant) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word downVote", data: plant })
            })
        });
    });



    api.delete('/delete/:id', (req, res) => {
        adminPlant.findById(req.params.id, (err, plant) => {
            plant.remove((err) => {
                if (err) {
                    return res.status(501).json({ success: 0, msg: "someplant went wrong" })
                }

                res.status(200).json({ success: 1, msg: "plant is deleted" });
            });

        });
    });




    return api;
};