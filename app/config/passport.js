'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;
					newUser.github.publicRepos = profile._json.public_repos;
					newUser.polls[0] = {"question":"What is your favorite animal?","answers":[{"answer":"Dog","votes":1},{"answer":"Cat","votes":2},{"answer":"Hamster","votes":4}]};
					newUser.polls[1] = {"question":"What is your favorite color?","answers":[{"answer":"Red","votes":100},{"answer":"Yellow","votes":40},{"answer":"Blue","votes":2},{"answer":"Green","votes":4}]};
					newUser.polls[2] = {"question":"What is your favorite flower?","answers":[{"answer":"Rose","votes":2},{"answer":"Lily","votes":6},{"answer":"Tulip","votes":5},{"answer":"Petunia","votes":1},{"answer":"Iris","votes":0}]};
					newUser.polls[3] = {"question":"What is your favorite food?","answers":[{"answer":"Pizza","votes":5},{"answer":"Hamburger","votes":25}]};
					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
};
