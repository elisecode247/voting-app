"use strict";
var mongoose = require("mongoose");
var Users = require("../models/users.js");

function pollsHandler() {

  this.getLatestPolls = function(req, res) {
    Users
      .aggregate({
        $project: {
          a: "$polls"
        }
      }, {
        $unwind: "$a"
      }, {
        $group: {
          "_id": "allpolls",
          result: {
            $addToSet: "$a"
          }
        }
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        if (result.length >= 1) {
          res.json(result[0].result.sort(function(a, b) {
            if (a._id > b._id) {
              return -1;
            } else if (a.question < b.question) {
              return 1;
            } else {
              return 0;
            }
          }));
        } else {
          res.send(null);
        }
      })
  }

  this.getPollDetails = function(req, res) {
    var pollId = mongoose.Types.ObjectId(req.params.pollId);
    Users
      .findOne({
        "polls._id": pollId
      }, {
        "polls._id.$": 1,
        _id: 0
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        res.json(result);
      })
  }

  this.castVote = function(req, res) {
    var choice = req.body.choices;
    var otherOption = req.body.otherOption;
    var pollId = mongoose.Types.ObjectId(req.params.pollId);
    var voter, elementPos, updateDoc, field;
    if (req.loggedIn === true) {
      voter = req.userId;
    } else {
      voter = req.headers["x-forwarded-for"] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress;
    }
    Users
      .find({
        "polls._id": mongoose.Types.ObjectId(pollId),
      }, {
        "polls._id.$": 1,
        _id: 0
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        if (result[0].polls[0].voters.indexOf(voter) > -1) {
          res.send(false);
        } else {
          updateVote();
        }
      })
        function updateVote() {
    if (choice === "Choose something else" && otherOption !== "") {
      Users
        .findOneAndUpdate({
          "polls._id": mongoose.Types.ObjectId(pollId)
        }, {
          $push: {
            "polls.$.answers": {
              "answer": otherOption,
              "votes": 1
            },
            "polls.$.voters": voter

          }
        })
        .exec(function(err, result) {
          if (err) {
            throw err;
          }
          res.send(true);
        })
    }
    else {
      Users
        .find({
          "polls._id": mongoose.Types.ObjectId(pollId)
        }, {
          "polls._id.$": 1,
          _id: 0
        })
        .exec(function(err, result) {
          if (err) {
            throw err;
          }
          elementPos = result[0].polls[0].answers
            .map(function(val) {
              return val.answer;
            })
            .indexOf(choice);
          var field = "polls.$.answers." + elementPos + ".votes";
          updateDoc = {};
          updateDoc[field] = 1;
          Users.findOneAndUpdate({
            "polls._id": mongoose.Types.ObjectId(pollId)
          }, {
            $inc: updateDoc,
            $push: {
              "polls.$.voters": voter
            }
          }).exec(function(err, result2) {
            if (err) {
              throw err;
            }
            res.send(true);
          })

        })
    }
  }

  }

  this.getUserPolls = function(req, res) {
    Users
      .findOne({
        "github.id": req.user.github.id
      }, {
        "_id": false
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
      .findOneAndUpdate({
        "github.id": req.user.github.id
      }, {
        $push: {
          "polls": {
            "question": pollName,
            "answers": pollOptions,
            "voters": []
          }
        }
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        res.redirect("/mypolls");
      });
  }

  this.deletePoll = function(req, res) {
    var pollId = mongoose.Types.ObjectId(req.params.pollId)
    Users
      .update({
        "polls._id": pollId
      }, {
        $pull: {
          "polls": {
            "_id": pollId
          }
        }
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        res.send(true);
      });
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
    }).map(function(val) {
      return {
        "answer": val,
        "votes": 0
      }
    })
  }


}

module.exports = pollsHandler;
