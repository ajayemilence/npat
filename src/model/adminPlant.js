let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let adminPlantSchema = new Schema({
    name: {
        type: String,
        lowercase: true
    },
    word: {
        type :String,
        uppercase : true
        },
    type: String,
    gender : String,
    createdAt : Date,
    updatedAt : Date,
    language : String,
    createdBy : String,
    upVote :  Number,
    downVote : Number

});

module.exports = mongoose.model('AdminPlant', adminPlantSchema);
