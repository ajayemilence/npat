let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let adminPlace = require('../model/adminPlace');

let storage = require('../middleware/storage');

var session = require('express-session');
var flash = require('connect-flash');
var csv = require("fast-csv");
var fs = require('fs');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // add place ============================>

    api.post('/addPlace', (req, res) => {
        adminPlace.findOne({ name: req.body.name }, (err, place) => {
            if (err) {
                return res.send(err);
            }

            if (place == null || !place) {

                let place = new adminPlace({
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
                place.save((error, place) => {
                    if (error) {
                        res.json({ success: 0, msg: error });
                    }

                    res.status(200).json({ success: 1, msg: 'place info added', data: place });

                });
            } else {
                place.upVote = place.upVote + req.body.upVote;
                place.downVote = place.downVote + req.body.downVote;

                place.save((err, place) => {
                    if (err) {
                        return res.status(201).json({ success: 0, msg: " error occurred while saving the upvote", Error: err })
                    }
                    return res.status(200).json({ success: 1, msg: " place word info added upvoted", data: place })
                });


            }
        });
    });


    //==============csv file uplodation ==========================



    api.post('/csvsample', (req, res) => {

        let upload = multer({ storage: storage }).single('csvFile');
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ success: 0, msg: "error in uploading", error: err })
            }


            var csvFileName = req.file.filename;
            //fs.createReadStream('./src/uploads/' + csvFileName)
                fs.createReadStream('/root/npatAPI/src/uploads/' + csvFileName)
                .pipe(csv())
                .on('data', function(data) {
                    // return new Promise((resolve, reject) => {
                    adminPlace.findOne({ name: data[1] }, (err, word) => {
                        if (word) {
                            console.log("already a word in place")
                        } else {
                            // body...
                            let place = new adminPlace({
                                name: data[1],
                                word: data[0],
                                createdBy: (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
                                createdAt: moment().local().valueOf(),
                                updatedAt: moment().local().valueOf(),
                                language: data[2],
                                upVote: (req.body.upVote === undefined) ? 0 : req.body.upVote,
                                downVote: (req.body.downVote === undefined) ? 0 : req.body.downVote
                            });
                            place.save((error, place) => {
                                if (error) {
                                    res.json({ success: 0, msg: error });
                                }
                            });
                        }
                    })
                //});
                })
                .on('end', function(data) {
                    res.json({ success: 1, msg: "csv file uploaded" });
                    console.log('read finished');
                })

        });
    });

    //===========================================

    api.get('/getAllplaces', (req, res) => {
        adminPlace.count({}, (err, placeCount) => {

            var limit = 35;
            console.log(placeCount);
            var pages = Math.ceil(placeCount / limit);
            if (req.query.pageNumber == undefined ||
                req.query.pageNumber == null ||
                req.query.pageNumber == "" ||
                req.query.pageNumber == 1) {
                skipCount = 0;
            } else {
                skipCount = (req.query.pageNumber - 1) * limit
            }
            adminPlace.find({}).sort({ name: 'asc' }).limit(limit)
                .skip(skipCount).exec((err, names) => {
                    if (err) {
                        return res.json({ success: 0, msg: "error occurred while retriving the names of human" });
                    }
                    return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names, numPages: pages });
                });
        });
    });









    api.put('/updatePlace/:id', (req, res) => {
        adminPlace.findById(req.params.id, (err, place) => {
            if (err) {
                return res.json({ msg: "error occurred in getting the place" })
            }
            place.name = (req.body.name === undefined) ? place.name : req.body.name,
                place.word = (req.body.word === undefined) ? place.word : req.body.word,
                place.type = (req.body.type === undefined) ? place.type : req.body.type,
                place.updatedAt = moment().local().valueOf(),
                place.language = (req.body.language === undefined) ? place.language : req.body.language,

                place.save(err => {
                    if (err) {
                        return res.json({ success: 0, msg: err });
                    }

                    res.status(200).json({ success: 1, msg: 'place info added', data: place });

                });
        });
    });







    api.delete('/delete/:id', (req, res) => {
        adminPlace.findById(req.params.id, (err, place) => {
            place.remove((err) => {
                if (err) {
                    return res.status(501).json({ success: 0, msg: "something went wrong" })
                }

                res.status(200).json({ success: 1, msg: "place is deleted" });
            });

        });
    });



    api.post('/upVote', (req, res) => {
        adminPlace.findOne({ name: req.body.name }, (err, place) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (place.upVote == undefined || place.upVote == NaN) {
                place.upVote = 0;
            }
            place.upVote = place.upVote + 1;
            place.save((err, place) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word upvoted", data: place })
            })
        });
    });


    api.post('/downVote', (req, res) => {
        adminPlace.findOne({ name: req.body.name }, (err, place) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (place.downVote == undefined || place.downVote == NaN) {
                place.downVote = 0;
            }
            place.downVote = place.downVote + 1;
            place.save((err, place) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word downVotet", data: place })
            })
        });
    });



    return api;
};