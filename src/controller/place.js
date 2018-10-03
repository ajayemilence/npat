let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let Place = require('../model/place');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // add place ============================>

    api.post('/addPlace', (req, res) => {
        Place.findOne({ name: req.body.name }, (err, place) => {
            if (err) {
                return res.send(err);
            }

            if (place == null || !place) {

                let place = new Place({
                    name: req.body.name,
                    word: req.body.word,
                    type: req.body.type,
                    createdBy : (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
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



     api.get('/getAllplaces', (req, res) => {
        if(req.query.type == undefined || req.query.type == null || req.query.type == "" || req.query.type == 0){
            languageType = "English";
        }
        else {
            languageType = "Arabian";
        }
        Place.count({language: languageType}, (err, placeCount) => {

            var limit = 20;
            var pages = Math.ceil(placeCount / limit);
            if (req.query.pageNumber == undefined ||
                req.query.pageNumber == null ||
                req.query.pageNumber == "" ||
                req.query.pageNumber == 1) {
                skipCount = 0;
            } else {
                skipCount = (req.query.pageNumber - 1) * limit
            }
            Place.find({language: languageType}).sort({ name: +1 }).collation( { locale: 'en', strength: 2 } ).limit(limit)
                .skip(skipCount).exec((err, names) => {
                    if (err) {
                        return res.json({ success: 0, msg: "error occurred while retriving the names of human" });
                    }
                    return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names, numPages: pages });
                });
        });
    });


    api.put('/updatePlace/:id', (req, res) => {
        Place.findById(req.params.id, (err, place) => {
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
        Place.findById(req.params.id, (err, place) => {
            place.remove((err) => {
                if (err) {
                    return res.status(501).json({ success: 0, msg: "something went wrong" })
                }

                res.status(200).json({ success: 1, msg: "place is deleted" });
            });

        });
    });



    api.post('/upVote', (req, res) => {
        Place.findOne({ name: req.body.name }, (err, place) => {
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
        Place.findOne({ name: req.body.name }, (err, place) => {
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