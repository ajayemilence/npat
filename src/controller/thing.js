let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let Thing = require('../model/thing');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // add thing ============================>

    api.post('/addThing', (req, res) => {
        Thing.findOne({ name: req.body.name }, (err, thing) => {
            if (err) {
                return res.send(err);
            }

            if (thing == null || !thing) {
                let thing = new Thing({
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
                thing.save((error, thing) => {
                    if (error) {
                        res.json({ success: 0, msg: error });
                    }

                    res.status(200).json({ success: 1, msg: 'thing info added', data: thing });

                });
            }
            else {
                thing.upVote = thing.upVote + req.body.upVote;
                thing.downVote = thing.downVote + req.body.downVote;

                thing.save((err, thing) => {
                    if (err) {
                        return res.status(201).json({ success: 0, msg: " error occurred while saving the upvote", Error: err })
                    }
                    return res.status(200).json({ success: 1, msg: " thing word info added upvoted", data: thing })
                });


            }
        });

    });

    api.get('/getAllthings', (req, res) => {
        Thing.find({}, (err, names) => {
            if (err) {
                res.json({ success: 0, msg: "error occurred while retriving the things" });
            }
            return res.status(200).json({ success: 1, msg: "succesfully get all names ", data: names });
        });
    });


    api.put('/updatething/:id', (req, res) => {
        Thing.findById(req.params.id, (err, thing) => {
            if (err) {
                return res.json({ msg: "error occurred in getting the thing" })
            }
            thing.name = (req.body.name === undefined) ? thing.name : req.body.name,
                thing.word = (req.body.word === undefined) ? thing.word : req.body.word,
                thing.type = (req.body.type === undefined) ? thing.type : req.body.type,
                thing.updatedAt = moment().local().valueOf(),
                thing.language = (req.body.language === undefined) ? thing.language : req.body.language,

                thing.save(err => {
                    if (err) {
                        return res.json({ success: 0, msg: err });
                    }

                    res.status(200).json({ success: 1, msg: 'thing info added', data: thing });

                });
        });
    });


    api.post('/upVote', (req, res) => {
        Thing.findOne({ name: req.body.name }, (err, thing) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (thing.upVote == undefined || thing.upVote == NaN) {
                thing.upVote = 0;
            }
            thing.upVote = thing.upVote + 1;
            thing.save((err, thing) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word upvoted", data: thing })
            })
        });
    });


    api.post('/downVote', (req, res) => {
        Thing.findOne({ name: req.body.name }, (err, thing) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (thing.downVote == undefined || thing.downVote == NaN) {
                thing.downVote = 0;
            }
            thing.downVote = thing.downVote + 1;
            thing.save((err, thing) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word downVote", data: thing })
            })
        });
    });

    api.delete('/delete/:id', (req, res) => {
        Thing.findById(req.params.id, (err, thing) => {
            thing.remove((err) => {
                if (err) {
                    return res.status(501).json({ success: 0, msg: "something went wrong" })
                }

                res.status(200).json({ success: 1, msg: "thing is deleted" });
            });

        });
    });







    return api;
};