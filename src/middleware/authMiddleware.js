let jwt = require('jsonwebtoken');
let expressJwt = require('express-jwt');

const TOKENTIME = 60*60*24*30	// this is a token time to expire the token
const SECRET = "This is a long secret passphrase of our company 3milence Pvt Ltd"

let authenticate = expressJwt({secret : SECRET});

let generateAccessToken = (req,res,next) => {

	//console.log('generateAccessToken');


	req.token = req.token || {};
	req.token = jwt.sign({
		id: req.user.id
	},SECRET,{
		expiresIn : TOKENTIME
	});

	next();
}
var respond = (req, res) => {
 if (req.user.confirmationStatus == "0"){
res.header('x-auth', req.token).status(201).
   json({
   success:0,
   message:"Request unsccessful please confirm you email first"
 });

 }
 else{
 res.header('x-auth', req.token).status(200).
 // res.status(200)
 json({
   success:1,
   message:"Request successful",
   user: req.user,
   token:req.token
 });
}
}

module.exports ={
	authenticate,
	generateAccessToken,
	respond

};