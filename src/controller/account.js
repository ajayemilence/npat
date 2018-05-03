let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let multer = require('multer');
let passport = require('passport');

let config = require('../config');
let Account = require('../model/account');
let storage = require('../middleware/storage');


let { authenticate, generateAccessToken, respond } = require('../middleware/authMiddleware');

module.exports = ({ config, db }) => {
    let api = express.Router();


    //  'v1/account/register'
    api.post('/register', (req, res) => {
        console.log('aaaa');

        let upload = multer({ storage: storage }).single('userPic');
        upload(req, res, (err) => {
            Account.register(new Account({
                username: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role,
                userPic: (req.file === undefined) ? "" : req.file.filename
            }), req.body.password, (error, account) => {

                if (error) {
                    return res.json({ success: 0, error });
                }
                req.user = Account;

                passport.authenticate('local', {
                    session: false
                }), generateAccessToken(req, res, () => {

                    res.status(200).json({ success: 1, msg: 'Registration successful', account: account });
                });
            });
        });
    });


    // v1/account/login
    api.post('/login', passport.authenticate('local', {
        session: false,
        scope: []
    }), generateAccessToken, respond);
    
    return api;

};