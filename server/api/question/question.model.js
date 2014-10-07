'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model');

var QuestionSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  // User schema groupId
  questionType: String,
  questionText: String
});

module.exports = mongoose.model('Question', QuestionSchema);