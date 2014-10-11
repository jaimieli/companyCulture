'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Group = require('../group/group.model')
var Game = require('../game/game.model')

var QuestionSchema = new Schema({
  active: Boolean,
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  gameId: {type: Schema.Types.ObjectId, ref: 'Game'},
  questionType: String,
  questionText: String,
  sortType: String,
  questionOption: {
    optionA: String,
    optionB: String
  },
  answersArray: [ {
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    answer: String
  }]
});

module.exports = mongoose.model('Question', QuestionSchema);