'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model.js');
var Question = require('../question/question.model.js');

var GameSchema = new Schema({
  active: Boolean,
  gameQuestion: String,
  answersArray : [ {userId: Number, answer: String } ],
  usersAnswered: [ {type: Schema.Types.ObjectId, ref: 'User'} ]
});

module.exports = mongoose.model('Game', GameSchema);