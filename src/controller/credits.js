let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');
let path = require('path');

let app = express();


let config = require('../config');
let Credit = require('../model/credits');

let storage = require('../middleware/storage');



module.exports = ({ config, db }) => {
    let api = express.Router();




    api.post('/add', (req, res) => {
        Credit.find({}, (err, credits) => {
            if (err) {
                return res.send(err);
            }

            if (credits[0] == null || !credits[0]) {
                let credit = new Credit({
                    credit: req.body.credit
                });

                credit.save((error, credit) => {
                    if (error) {
                        res.json({ success: 0, msg: error });
                    }

                    res.status(200).json({ success: 1, msg: 'credit info added', data: credit });

                });
            } else {
                var credit = credits[0]
                credit.credit = req.body.credit;

                credit.save((err, credit) => {
                    if (err) {
                        return res.status(201).json({ success: 0, msg: " error occurred while saving the credits", Error: err })
                    }
                    return res.status(200).json({ success: 1, msg: " credits info updated", data: credit })
                });
            }

        });
    });




    api.get('/getAll', (req, res) => {
        Credit.find({} , (err, credits) => {
            if (err) {
                res.json({ success: 0, msg: "error occurred while retriving the credits" });
            }
            return res.status(200).json({ success: 1, msg: "succesfully get all credits", data: credits });
        });
    });




    return api;
};

