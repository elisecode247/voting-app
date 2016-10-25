'use strict';

var path = process.cwd();
var PollsHandler = require(path + '/app/controllers/pollsHandler.server.js');
var bodyParser = require('body-parser');

module.exports = function(app, passport) {
  
  var pollsHandler = new PollsHandler();
  var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      res.redirect('/login');
    }
  }

  function isLoggedInOptional(req,res,next){
    if (req.isAuthenticated()) {
      req.loggedIn = true;
    } else {
      req.loggedIn = false;
    }
      return next();
  }

  app.route('/')
    .get(isLoggedInOptional, function(req, res) {
      res.render('index', {
        loggedIn: req.loggedIn
      });
    });

  app.route('/login')
    .get(function(req, res) {
      res.render('index', {
        loggedIn: false
      });
    });
    
  app.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/mypolls')
    .get(isLoggedIn, function(req, res) {
      res.render('mypolls', {
        loggedIn: true
      });
    });

  app.route('/formaddpoll')
    .get(isLoggedIn, function(req, res) {
      res.render('formaddpoll', {
        loggedIn: true
      });
    })


  app.route('/polldetails')
    .get(isLoggedInOptional, function(req, res) {
      res.render('polldetails', {
        loggedIn: req.loggedIn
      });
    });  

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/api/:id')
    .get(isLoggedIn, function(req, res) {res.json(req.user);})


  app.route('/api/poll/:pollId')
    .get(urlencodedParser,pollsHandler.getPollDetails)
    .post(urlencodedParser,pollsHandler.addPoll)
    .delete(urlencodedParser,pollsHandler.deletePoll);

  app.route('/api/latestpolls')
    .get(pollsHandler.getLatestPolls)

};

