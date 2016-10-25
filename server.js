'use strict';

var express = require('express');
var routes = require('./app/routes');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var port = process.env.PORT || 8080;
var path = require('path');
var app = express();

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

routes(app, passport);

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});