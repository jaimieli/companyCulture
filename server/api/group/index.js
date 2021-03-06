'use strict';

var express = require('express');
var controller = require('./group.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/setLeaderboardData', controller.setLeaderboardData);
router.post('/validateEmails', controller.validateEmails);
router.post('/removeMember/:id', controller.removeMember);
router.post('/:id/updateBestTime', auth.isAuthenticated(), controller.updateBestTime)
router.get('/addInvitee/:id', auth.isAuthenticated(), controller.addInvitee);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;