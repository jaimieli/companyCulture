'use strict';

angular.module('companyCultureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group/:id',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        controllerAs: 'Group'
      })
  });