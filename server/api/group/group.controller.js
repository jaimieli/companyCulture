'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model')
var async = require('async');

// Add User and Update Group

exports.addInvitee = function(req, res) {
  Group.findById(req.params.id, function(err, group) {
    var updatedObj = {}
    if (err) {return handleError(res, err);}
    if (!group) {return res.send(404);}

    var updateGroup = function(callback) {
      // remove user from invitee list
      var len = group.invited.length;
      for (var i = 0; i < len; i++) {
        group.invited.splice(i, 1);
      }
      // add user to group object
      group.users.addToSet(req.user._id);
      // save group
      group.save(function (err) {
        if (err) { return handleError(res, err); }
        updatedObj.group = group;
        callback();
      }), function(err) {
        if(err) console.log(err);
        callback();
      }
    }

    var updateUser = function(callback) {
      // add group to user object
      req.user.groups.addToSet(group._id);
      // save user
      req.user.save(function(err, user){
        updatedObj.user = user;
        callback()
      }), function(err) {
        if(err) console.log(err);
        callback();
      }
    }

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
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    return res.json(group);
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  console.log('req.user before: ', req.user);

  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
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