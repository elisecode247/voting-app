'use strict';
var mongoose = require('mongoose');
var Users = require('../models/users.js');

function pollsHandler() {

  this.getLatestPolls = function(req, res) {
    var pollId = mongoose.Types.ObjectId(req.params.pollId)
     Users
      .findOne({"polls._id":pollId},{"polls._id.$": 1,_id:0})
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
          res.json(result)
      })
  }

  this.getPollDetails = function(req, res) {
    var pollId = mongoose.Types.ObjectId(req.params.pollId)
     Users
      .findOne({"polls._id":pollId},{"polls._id.$": 1,_id:0})
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
          res.json(result)
      })
  }

  this.getUserPolls = function(req, res) {
    Users
      .findOne({
        'github.id': req.user.github.id
      }, {
        '_id': false
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        res.json(result.polls);
      })
  }
  this.addPoll = function(req, res) {
    var pollName = req.body.pollName;
    var pollOptions = getPollOptionsArray(req.body.pollOptions);
		Users
			.findOneAndUpdate({'github.id': req.user.github.id },
			{ $push: {"polls":{"question": pollName, "answers":pollOptions}}})
			.exec(function (err, result) {
					if (err) { throw err; }
					res.redirect("/mypolls");
				}
			);
  }
  
  this.deletePoll = function(req, res) {
    var pollId = mongoose.Types.ObjectId(req.params.pollId)
    console.log(req.params.pollId)
		Users
			.update({"polls._id":pollId},{$pull:{"polls":{"_id": pollId}}})
			.exec(function (err, result) {
					if (err) { throw err; }
					res.send(true)
				}
			);
  }

  function getPollOptionsArray(pollOptions) {
    var re = /\n|\r/ig;
    var optionsArray = [];
    var stringIndex = 0;
    var match = null;
    while ((match = re.exec(pollOptions)) != null) {
      optionsArray.push(pollOptions.slice(stringIndex, match.index).toString())
      stringIndex = match.index + 1
    }
    optionsArray.push(pollOptions.slice(stringIndex));
    return optionsArray.filter(function(value) {
      return value !== ""
    }).map(function(val){
      return {"answer":val, "votes": 0}
    })
  }


}

module.exports = pollsHandler;