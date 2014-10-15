'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Group = require('../group/group.model')
var Game = require('../game/game.model')

var QuestionSchema = new Schema({
  active: Boolean,
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  questionType: String,
  questionText: String,
  sortType: String,
  questionOption: {
    optionA: String,
    optionB: String
  },
  answersArray: [ {
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    answer: String,
    completed: Boolean,
    gameTime: { type: Number, default: null }
  }],
  activeGame: Boolean
});

module.exports = mongoose.model('Question', QuestionSchema);