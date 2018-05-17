let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let placeSchema = new Schema({
    name: {
        type: String
    },
    word: String,
    type: String,
    gender : String,
    createdAt : Date,
    updatedAt : Date,
    language : String,
    createdBy : String,
    upVote :  Number,
    downVote : Number

});

module.exports = mongoose.model('Place', placeSchema);
