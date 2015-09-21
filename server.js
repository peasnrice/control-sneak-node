// server.js

// set up
// gather requirements ================================
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var jwt    = require('jsonwebtoken');

// morgan used for logging
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');
var jwtSecret = require('./config/jwt.js');
app.set('superSecret', jwtSecret.secret); // secret variable

// configuration ======================================
//connec to the DB
mongoose.connect(configDB.url); 

// pass passport for configuration
require('./config/passport')(passport); 

// log all requests
app.use(morgan('dev'));
app.use(cookieParser());

// passport setup
app.use(session({secret: 'iloveitwhenthingswork'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// routes =============================================
require('./app/routes.js')(app,passport, jwt);

//launch ==============================================
app.listen(port);
console.log('It is happening on port ' + port);
