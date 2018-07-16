let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');


let AccountSchema = new Schema({
    username: {
        type: String,
        //required: true
    },
    email: {
        type: String,
       // required: true
    },
    password: String,
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    userPic: {
        type: String
    },
    role : String
});

// AccountSchema.plugin(timestamps);---to get the time 
AccountSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', AccountSchema);