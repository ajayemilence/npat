
//require('newrelic');
global.express = require('express');
global.app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
global.hbs = require('hbs');
var session = require('express-session');
var dotenv = require('dotenv');
var fs = require('fs');
dotenv.load();
//var RedisStore = require('connect-redis')(session);
//var redis_url = process.env.REDIS_URL;

restrict = function (req, res, next) {
    if (req.session.user) { return next(); } else {
        req.session.error = 'Access denied!';
        if (!req.xhr)
            req.session.returl = req.originalUrl;
        res.redirect('/');
    }   
}

global.glob_ghorg;
global.appPath = __dirname;

//if (redis_url == undefined) {
    app.use(session({
        secret: 'max',
        saveUninitialized: false,
        resave: false,
        cookie: {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60000),
            maxAge: 30 * 24 * 60 * 60000
        }
    }));
//}
//else {
  //  app.use(session({
   //     store: new RedisStore({ url: redis_url }),
    //    secret: 'max',
     //   saveUninitialized: false,
     //   resave: false,
      //  cookie: {
      //      expires: new Date(Date.now() + 30 * 24 * 60 * 60000),
      //      maxAge: 30 * 24 * 60 * 60000
     //   }
  //  }));
//}

hbs.registerPartials(__dirname + '/app/views/partials');
require('./app/helper/customHelpers')

// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'hbs');

//uncomment after placing your favicon in /public  
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

var compression = require('compression');
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', require('./routes/index.js'));
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    res.format({
        html: function () {
            res.render('404', { layout: null, url: req.url })
        },
        json: function () {
            res.json({ error: 'Not found' })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
});


//app.use(rollbar.errorHandler(RollbarSecretKey, { environment: process.env.ENVIRONMENT }));
app.use(function (err, req, res, next) {
    res.locals.message = err.message;

    // render the error page
    res.status(err.status || 500);
    if (err.status == 500 && !req.xhr) {        
        res.render('500', { layout: null });
    }
    else if (err.status == 401 && !req.xhr) {
        res.render('401', { layout: null });
    }
    else if (err.status == 404 && !req.xhr) {
        res.render('404', { layout: null, url: req.url })
    }
    else {       
        if (req.xhr)
            res.status( err.http_code || 500).send('error')
    }
});

module.exports = app;

var debug = require('debug')('Chef Teck:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4050');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port,function(){
  console.log('Ready on port %d', server.address().port);
});
server.on('error', onError);
server.on('listening', onListening);
server.timeout = 240000; 
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

