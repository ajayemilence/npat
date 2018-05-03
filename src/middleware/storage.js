let multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, './src/uploads/')
	},
	filename : (req, file,cb) => {
		cb(null, Date.now() + '-' + file.originalname)
	}
});
module.exports = storage;
