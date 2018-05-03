let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');

let config = require('../config');
let Animal = require('../model/animal');



module.exports = ({ config, db }) => {
    let api = express.Router();


    // add animal ============================>

    api.post('/addAnimal', (req, res) => {
        let animal = new Animal({
            name: req.body.name,
            word: req.body.word,
            type: req.body.type,
            createdAt: moment().local().valueOf(),
            updatedAt: moment().local().valueOf(),
            language: req.body.language
        });
        animal.save((error, animal) => {
            if (error) {
                res.json({ success: 0, msg: error });
            }

            res.status(200).json({ success: 1, msg: 'animal info added', data: animal });

        });
    });




    api.put('/updateAnimal/:id', (req, res) => {

        Animal.findById(req.params.id, (err, animal) => {
            if (err) {
                return res.json({ msg: "error occurred in getting the animal" })
            }

            animal.name = (req.body.name === undefined) ? animal.name : req.body.name,
                animal.word = (req.body.word === undefined) ? animal.word : req.body.word,
                animal.type = (req.body.type === undefined) ? animal.type : req.body.type,
                animal.updatedAt = moment().local().valueOf(),
                animal.language = (req.body.language === undefined) ? animal.language : req.body.language,

                animal.save(err => {
                    if (err) {
                        return res.json({ success: 0, msg: err });
                    }

                    res.status(200).json({ success: 1, msg: 'animal info added', data: animal });

                });
        });
    });



    api.get('/getAllAnimals', (req, res) => {
        Animal.find({}, (err, names) => {
            if (err) {
                res.json({ success: 0, msg: "error occurred while retriving the animals" });
            }
            return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names });
        });
    });

    api.post('/upVote', (req, res) => {
        Animal.findOne({ name: req.body.name }, (err, animal) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (animal.upVote == undefined || animal.upVote == NaN) {
                animal.upVote = 0;
            }
            animal.upVote = animal.upVote + 1;
            animal.save((err, animal) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word upvoted", data: animal })
            })
        });
    });

    api.post('/downVote', (req, res) => {
        Animal.findOne({ name: req.body.name }, (err, animal) => {
            if (err) {
                return res.json({ success: 0, msg: "error occurred whilw retriving the word" });
            }

            if (animal.downVote == undefined || animal.downVote == NaN) {
                animal.downVote = 0;
            }
            animal.downVote = animal.downVote + 1;
            animal.save((err, animal) => {
                if (err) {
                    return res.status(201).json({ success: 1, msg: " error occurred while saving the upvote" })
                }
                return res.status(200).json({ success: 0, msg: "word downVoted", data: animal })
            })
        });
    });


    api.delete('/delete/:id', (req, res) => {
        Animal.findById(req.params.id, (err, animal) => {
            animal.remove((err) => {
                if(err){
                    return res.status(501).json({success : 0 , msg : "something went wrong"})
                }
                
                    res.status(200).json({ success: 1, msg: "animal is deleted" });
            });

        });
    });








    return api;
};