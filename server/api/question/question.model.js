'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Group = require('../group/group.model')

var QuestionSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  questionType: String,
  questionText: String,
  answersArray: [ {
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    answer: String
  }]
});

module.exports = mongoose.model('Question', QuestionSchema);