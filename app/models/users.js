"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String
	},
   polls: [{
     question: String,
     answers: [{
       _id: false,
       answer: String,
       votes: Number
     }],
     voters: [String]
   }]
});

module.exports = mongoose.model("User", User);
