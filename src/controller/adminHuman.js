let express = require('express');
let mongoose = require('mongoose');
let multer = require('multer');
let moment = require('moment');
let path = require('path');

let app = express();


let config = require('../config');
let adminHuman = require('../model/adminHuman');

let storage = require('../middleware/storage');

var session = require('express-session');
var flash = require('connect-flash');
var csv = require("fast-csv");
var fs = require('fs');

module.exports = ({ config, db }) => {
    let api = express.Router();



    //var csvfile = __dirname + "/files/name.csv";
    //var stream = fs.createReadStream(csvfile);


    // ======csv file uplodation =================


    app.use('/image', express.static(__dirname + '../uploads'));

    api.post('/csvsample', (req, res) => {

        let upload = multer({ storage: storage }).single('csvFile');
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ success: 0, msg: "error in uploading", error: err })
            }

            //             const csvFilePath='<path to csv file>'
            // const csv=require('csvtojson')
            // csv()
            // .fromFile(csvFilePath)
            // .then((jsonObj)=>{
            //     console.log(jsonObj);

            // });

            var csvFileName = req.file.filename;

            fs.createReadStream('/root/npatAPI/src/uploads/' + csvFileName)
                .pipe(csv())
                .on('data', function(data) {
                    adminHuman.findOne({ name: data[1] }, (err, word) => {
                        if (word) {
                            console.log("already a word in place")
                        } else {
                            // body...

                            let human = new adminHuman({
                                name: data[1],
                                word: data[0],
                                //type: req.body.type,
                                gender: data[3],
                                createdBy: (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
                                createdAt: moment().local().valueOf(),
                                updatedAt: moment().local().valueOf(),
                                language: data[2],
                                upVote: (req.body.upVote === undefined) ? 0 : req.body.upVote,
                                downVote: (req.body.downVote === undefined) ? 0 : req.body.downVote
                            });
                            human.save((error, human) => {
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



    // app.use('/image', express.static(__dirname + '/uploads'));













    api.post('/addHuman', (req, res) => {
        adminHuman.findOne({ name: req.body.name }, (err, human) => {
            if (err) {
                return res.send(err);
            }

            if (human == null || !human) {

                let human = new adminHuman({
                    name: req.body.name,
                    word: req.body.word,
                    type: req.body.type,
                    gender: req.body.gender,
                    createdBy: (req.body.createdBy === undefined) ? "Admin" : req.body.createdBy,
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
                        return res.status(201).json({ success: 0, msg: " error occurred while saving the upvote", Error: err })
                    }
                    return res.status(200).json({ success: 1, msg: " human word info added upvoted", data: human })
                });
            }

        });
    });



    api.get('/getAllNames', (req, res) => {
        adminHuman.count({}, (err, humanCount) => {

            var limit = 35;
            console.log(humanCount);
            var pages = Math.ceil(humanCount / limit);
            console.log("count");
            console.log(pages);
            if (req.query.pageNumber == undefined ||
                req.query.pageNumber == null ||
                req.query.pageNumber == "" ||
                req.query.pageNumber == 1) {
                skipCount = 0;
            } else {
                skipCount = (req.query.pageNumber - 1) * limit
                console.log(req.query.pageNumber);
                console.log(skipCount);
            }
            adminHuman.find({}).sort({ name: 'asc' }).limit(limit)
                .skip(skipCount).exec((err, names) => {
                    if (err) {
                        return res.json({ success: 0, msg: "error occurred while retriving the names of human" });
                    }
                    return res.status(200).json({ success: 1, msg: "succesfully get all names", data: names, numPages: pages });
                });
        });
    });





    api.put('/updateHuman/:id', (req, res) => {
        adminHuman.findById(req.params.id, (err, human) => {
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
        adminHuman.findOne({ name: req.body.name }, (err, human) => {
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
        adminHuman.findOne({ name: req.body.name }, (err, human) => {
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
        adminHuman.findById(req.params.id, (err, human) => {
            human.remove((err) => {
                if (err) {
                    return res.status(501).json({ success: 0, msg: "something went wrong" })
                }

                res.status(200).json({ success: 1, msg: "human is deleted" });
            });

        });
    });


    return api;
};

//csv file import


// $(function(){

//     /** Click on Fetch data and display in HTML table **/

//     $("#fetchdata").on('click', function(){

//         $.get( "/fetchdata", function( data ) {

//             var products = data['data'];

//             $("#trdata").html('');

//             $("#message").hide();

//             var string = '';

//             $.each(products, function(index, product ) {

//                 string += '<tr><td>'+(index+1)+'</td><td>'+product['_id']+'</td><td>'+product['name']+'</td><td>'+product['category']+'</td><td>'+product['price']+'</td><td>'+product['manufacturer']+'</td></tr>';

//             });

//             $("#trdata").html(string);

//         });
//     });

//     /** Import data after click on a button */

//     $("#importdata").on('click', function(){

//         $.get( "/import", function( data ) {

//             $("#message").show().html(data['success']);

//         });

//     });

// });