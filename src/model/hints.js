let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hintsSchema = new Schema({
    name: {
        type: String
    },
    type: String,
    language : String,

});

module.exports = mongoose.model('Hints', hintsSchema);
