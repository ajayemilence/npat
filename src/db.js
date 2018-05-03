let mongoose = require('mongoose');
let config = require('./config');

module.exports = callback => {
	let db = mongoose.connect(config.mongoUrl);
	callback(db);
};