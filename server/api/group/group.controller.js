'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model')
var async = require('async');
var exec = require('child_process').exec;

// set leaderboard data
exports.setLeaderboardData = function(req, res){
  var users = req.body.users;
  console.log('req.body.users in setLeaderboardData: ', req.body.users)
  var memberData = []
  var setMemberData = function(member, done) {
    var randomBird = Math.ceil(Math.random() * 10);
    var memberObj = {};
    memberObj.item = member.user;
    memberObj.bestScore = member.bestTime;
    memberData.push(memberObj);
    done();
  }
  var complete = function (err) {
    if (err) console.log(err);
    res.send(200, memberData);
  }
  async.each(users, setMemberData, complete);
}

// Validate emails
exports.validateEmails = function (req, res) {
  console.log('req.body: ', req.body)
  var group = req.body
  var invitedArr = req.body.invited;
  var validateEmail = function(indiv, callback) {
    var emailHost = indiv.email.split('@')[1];
    console.log('emailHost: ', emailHost);
    var result = {};
    result.email = req.body.email;
    exec('host -t mx ' + emailHost, function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error);
      }
      console.log('stdout: ' + stdout);
      if (stdout.toLowerCase().indexOf('google.com') !== -1) {
        indiv.valid = true;
        callback();
      } else {
        indiv.valid = false;
        callback();
      }
    });
  }
  var doneValidating = function(err) {
    if(err) console.log(err);
    console.log('group in validating: ', group);
    res.send(200, group);
  }
  async.each(invitedArr, validateEmail, doneValidating)
}

// Update best time
exports.updateBestTime = function(req, res) {
  console.log('req.user: ', req.user);
  console.log('req.params: ', req.params);
  Group.findById(req.params.id, function(err, group){
    var len = group.users.length;
    for (var i = 0; i < len; i++) {
      if(group.users[i].user.toString() === req.user._id.toString()) {
        console.log('found user to update best time');
        group.users[i].bestTime = req.body.score;
        break;
      }
    }
    group.save(function(err){
      if(err) { return handleError(res, err); }
      res.send(200, group);
    })
  })
}
// Remove User and Update Group
exports.removeMember = function(req, res){
  console.log('in removeMember backend')
  var userToRemove = req.body;
  var groupToRemoveFrom = req.params.id;
  var updatedObj = {};
  console.log('userToRemove: ', userToRemove);
  console.log('groupToRemoveFrom: ', groupToRemoveFrom)

  var updateGroup = function(callback) {
    Group.findById(groupToRemoveFrom, function(err, group){
      if (err) {return handleError(res, err);}
      if (!group) {
        console.log('this group does not exist');
        return res.send(404);
      }
      // remove user from group.users
      var len = group.users.length;
      for (var i = 0; i < len; i++) {
        if (group.users[i].user.toString() === userToRemove._id) {
          console.log('removing user ' + userToRemove._id + ' from group.users of group ' + groupToRemoveFrom._id);
          group.users.splice(i, 1);
          break;
        }
      }
      // save group
      group.save(function(err){
        if(err) { return handleError(res, err); }
        updatedObj.group = group;
        callback();
      })
    })
  }

  var updateUser = function(callback){
    console.log('userToRemove._id: ', userToRemove._id)
    User.findById(userToRemove._id, function(err, user){
      if (err) {return handleError(res, err);}
      if (!user) {
        console.log('this user does not exist')
        return res.send(404);
      }
      // remove group from user object
      var len = user.groups.length;
      for (var i = 0; i < len; i++) {
        if(user.groups[i].toString() === groupToRemoveFrom) {
          console.log('removing group ' + groupToRemoveFrom + ' from user.groups of user ' + user.groups[i].toString())
          user.groups.splice(i, 1);
          break;
        }
      }
      // save user
      user.save(function(err){
        if(err) { return handleError(res, err); }
        updatedObj.user = user;
        callback();
      })
    })
  }
  async.parallel([updateGroup, updateUser], function(err, results){
    if (err) console.log(err);
    return res.json(200, updatedObj)
  })
}

// Add Invitee to Group, Update Group, and Add Group to User Object
exports.addInvitee = function(req, res) {
  Group.findById(req.params.id, function(err, group) {
    var updatedObj = {}
    if (err) {return handleError(res, err);}
    if (!group) {return res.send(404);}

    var updateGroup = function(callback) {
      // remove user from invitee list
      var len = group.invited.length;
      for (var i = 0; i < len; i++) {
        if (group.invited[i] !== null) {
          if(req.user.email === group.invited[i].email){
            group.invited.set(i, undefined);
          }
        }
      }
      console.log('group.invited outside loop: ', group.invited);

      // add user to group object if s/he doesn't already exist
      var match;

      var checkUser = function(person, checkedOneUser) {
        User.findById(person.user.toString(), function(err, user){
          if(user._id.toString() === req.user._id.toString()) {
            match = true;
            console.log('match found: ', match);
            checkedOneUser();
          } else {
            checkedOneUser();
          }
        })
      }

      var doneChecking = function(err) {
        console.log('done checking');
        if (err) console.log(err);
        if (!match) {
          console.log('current user does not match any existing users');
          group.users.addToSet({user: req.user._id});
          group.save(function (err) {
            if (err) { return handleError(res, err); }
            updatedObj.group = group;
            callback();
          });
        } else {
          console.log('user already exists in group so was not added')
          group.save(function (err) {
            if (err) { return handleError(res, err); }
            updatedObj.group = group;
            callback();
          });
        }
      }

      async.each(group.users, checkUser, doneChecking)
    };

    var updateUser = function(callback) {
      // add group to user object
      req.user.groups.addToSet(group._id);
      // save user
      req.user.save(function(err, user){
        updatedObj.user = user;
        callback()
      });
    };

    async.parallel([updateGroup, updateUser], function(err, results){
      if (err) console.log(err);
      return res.json(200, updatedObj)
    })

  })
}
// Get list of groups
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  // populate users
  Group.findOne({_id: req.params.id})
    .populate('users.user')
    .populate('questionsArr')
    .exec(function(err, results){
      console.log(results);
      res.send(results);
    })
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  console.log('req.user before: ', req.user);

  Group.create(req.body, function(err, group) {
    if(err) {
      console.log(err);
      return handleError(res, err);
    }
    req.user.groups.addToSet(group._id);
    req.user.groupsAdmin.addToSet(group._id);
    req.user.save(function(err, user){
      console.log('user after save: ', user);
    });
    return res.json(201, group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}