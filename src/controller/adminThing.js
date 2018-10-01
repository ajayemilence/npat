let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let adminThing = require('../model/adminThing');

let storage = require('../middleware/storage');

var session = require('express-session');
var flash = require('connect-flash');
var csv = require("fast-csv");
var fs = require('fs');


module.exports = ({ config, db }) => {
    let api = express.Router();


    // add thing ============================>

    api.post('/addThing', (req, res) => {
        adminThing.findOne({ name: req.body.name }, (err, thing) => {
            if (err) {
                return res.send(err);
            }

            if (thing == null || !thing) {
                let thing = new adminThing({
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
                thing.save((error, thing) => {
                    if (error) {
                        res.json({ success: 0, msg: error });
                    }

                    res.status(200).json({ success: 1, msg: 'thing info added', data: thing });

                });
            } else {
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



    //==============csv file uplodation ==========================


    api.post('/csvsample', (req, res) => {

        let upload = multer({ storage: storage }).single('csvFile');
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ success: 0, msg: "error in uploading", error: err })
            }

            var csvFileName = req.file.filename;

            fs.createReadStream('/root/npatAPI/src/uploads/' + csvFileName)
                .pipe(csv())
                .on('data', function(data) {
                    adminThing.findOne({ name: data[1] }, (err, word) => {
                        if (word) {
                            console.log("already a word in place")
                        } else {
                            // body...
                            let thing = new adminThing({
                                word: data[0],
                                name: data[1],
                                createdBy: (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
                                createdAt: moment().local().valueOf(),
                                updatedAt: moment().local().valueOf(),
                                language: data[2],
                                upVote: (req.body.upVote === undefined) ? 0 : req.body.upVote,
                                downVote: (req.body.downVote === undefined) ? 0 : req.body.downVote
                            });
                            thing.save((error, thing) => {
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



    api.get('/getAllthings', (req, res) => {
        adminThing.count({}, (err, thingCount) => {

            var limit = 20;
            console.log(thingCount);
            var pages = Math.ceil(thingCount / limit);
            if (req.query.pageNumber == undefined ||
                req.query.pageNumber == null ||
                req.query.pageNumber == "" ||
                req.query.pageNumber == 1) {
                skipCount = 0;
            } else {
                skipCount = (req.query.pageNumber - 1) * limit
            }
            adminThing.find({}).sort({ name: +1 }).collation( { locale: 'en', strength: 2 } ).limit(limit)
                .skip(skipCount).exec((err, names) => {
                    if (err) {
                        return res.json({ success: 0, msg: "error occurred while retriving the names of human" });
                    }
                    return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names, numPages: pages });
                });
        });
    });




    api.put('/updatething/:id', (req, res) => {
        adminThing.findById(req.params.id, (err, thing) => {
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
        adminThing.findOne({ name: req.body.name }, (err, thing) => {
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
        adminThing.findOne({ name: req.body.name }, (err, thing) => {
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
        adminThing.findById(req.params.id, (err, thing) => {
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