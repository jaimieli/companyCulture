'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var exec = require('child_process').exec;

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.validateEmails = function (req, res) {
  console.log('in validateEmails backend');
  console.log('req.body: ', req.body)
  console.log('split array: ', req.body.email.split('@'));
  var emailHost = req.body.email.split('@')[1];
  console.log('emailHost: ', emailHost);
  var result = {};
  result.email = req.body.email;
  exec('host -t mx ' + emailHost, function(error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
    }
    console.log('stdout: ' + stdout);
    console.log('typeof stdout: ', typeof stdout);
    if (stdout.toLowerCase().indexOf('google.com') !== -1) {
      result.valid = true;
    } else {
      result.valid = false;
    }
    res.send(200, result);
  });
}


exports.getGroups = function(req, res) {
  var groups = {};
  User.findOne({_id: req.user._id})
      .populate('groupsAdmin')
      .populate('groups')
      .exec(function(err, results) {
        console.log(results);
        res.send(results)
  })
}
/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/user');
};
