'use strict';

var _ = require('lodash');
var Question = require('./question.model');
var Group = require('../group/group.model')

// Add answer to list of questions
exports.addAnswer = function(req, res){
  Question.findById(req.params.id, function(err, question){
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.answersArray.addToSet(req.body);
    question.save(function(err, question){
      if(err){
        console.log(err);
        return handleError(res, err);
      }
      question.populate('answersArray');
      return res.json(200, question)
    })
  })
}

// user completed game
exports.userCompleted = function(req, res){
  console.log('req.params: ', req.params);
  console.log('req.user: ', req.user);
  Question.findById(req.params.id, function(err, question){
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    var len = question.answersArray.length;
    for (var i = 0; i < len; i++) {
      if (question.answersArray[i].user.toString() === req.user._id.toString()) {
        console.log('found user');
        question.answersArray[i].completed = true;
        break;
      }
    }
    question.save(function(err, question){
      if(err){
        console.log(err);
        return handleError(res, err);
      }
      question.populate('answersArray');
      return res.json(200, question)
    })
  })
}
// Get list of questions
exports.index = function(req, res) {
  Question.find(function (err, questions) {
    if(err) { return handleError(res, err); }
    return res.json(200, questions);
  });
};

// Get a single question
exports.show = function(req, res) {
  Question.findOne({_id: req.params.id})
    .populate('users')
    .populate('gameId')
    .populate('answersArray')
    .populate('answersArray.user')
    .exec(function(err, results){
      console.log(results);
      res.send(results);
    })
};

// Creates a new question in the DB and adds question to group's questionArr
exports.create = function(req, res) {
  console.log('inside create')
  Question.create(req.body, function(err, question) {
    console.log('creating a question')
    var groupId = req.params.id;
    if(err) { return handleError(res, err); }
    Group.findById(groupId, function(err, group){
      console.log('inside group findbyid')
      console.log('group.questionsArr: ', group.questionsArr);
      if(err) { return handleError(res, err); }
      if(!group) { return res.send(404) }
      console.log('after error handling');
      console.log('question: ', question)
      group.questionsArr.addToSet(question._id);
      console.log('group after adding to questionsArr: ', group);
      group.save(function(err){
        if (err) {
          console.log(err);
          return handleError(res, err);
        }
        return res.json(group);
      })
    })
  });
};

// Updates an existing question in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    var updated = _.merge(question, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Deletes a question from the DB.
exports.destroy = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}