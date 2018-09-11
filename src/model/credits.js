let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CreditSchema = new Schema({
    credit: {
        type: String
    }

});

module.exports = mongoose.model('Credit', CreditSchema);
