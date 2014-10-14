'use strict';

var express = require('express');
var controller = require('./question.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id/userCompleted', auth.isAuthenticated(), controller.userCompleted);
router.post('/:id/addAnswer', controller.addAnswer);
router.post('/:id', controller.create);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;