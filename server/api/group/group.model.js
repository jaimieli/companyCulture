'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model');
var Question = require('../question/question.model')

var GroupSchema = new Schema({
  groupName: String,
  active: Boolean,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // users: [{
  //           user: { type: Schema.Types.ObjectId, ref: 'User' },
  //           bestTime: { type: Number, default: null }
  //         }]
  questionsArr: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  invited: []
});

// var AnswerSchema = new Schema({
//   user: { type: String, default: ''},
//   answer: String
// }, { _id: false });

// var QuestionsArrSchema = new Schema({
//   question: { type: String, default: ''},
//   answersArr: [AnswerSchema]
// }, { _id: false });

// var GroupSchema = new Schema({
//   groupName: String,
//   active: Boolean,
//   users: [{ type: String, default: '' }],
//   questionsArr: [ QuestionsArrSchema ],
//   admin: { type: Schema.Types.ObjectId, ref: 'User' },
//   invited: [Schema.Types.Mixed]
// });

module.exports = mongoose.model('Group', GroupSchema);




