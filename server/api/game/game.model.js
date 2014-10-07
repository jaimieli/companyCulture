'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var user = require('../user/user.model.js');
var question = require('../question/question.model.js');

var GameSchema = new Schema({
  active: Boolean,
  gameQuestion: String,
  answersArray : [{userId: Number, answer: String }]

});

module.exports = mongoose.model('Game', GameSchema);