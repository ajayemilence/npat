let express = require('express');
let qt = require('quickthumb');
let bodyParser = require('body-parser');

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let app = express();

let http = require('http').Server(app);

let config = require('./config');
let routes = require('./routes');


//  parse application /json
app.use(bodyParser.json({
	limit: config.bodyLimit
}));

app.use('/image', qt.static(__dirname + '/uploads'));

app.use('/npat', express.static(__dirname + '/readme'));

app.use(passport.initialize());

let Account = require('./model/account');
//let Employee = require('./model/employee');

passport.use('local' , new LocalStrategy({
	usernameField : 'email',
	passwordField: 'password'
},
	//Employee.authenticate(),

	Account.authenticate()
));

	passport.serializeUser(Account.serializeUser());
	passport.deserializeUser(Account.deserializeUser());


// api Routes v1
app.use('/v1', routes);

//starting sserver on port
http.listen(config.port, () =>{
	console.log('App is started on port 4012 ') //+http.address() + port + '...'
})

module.exports = app;