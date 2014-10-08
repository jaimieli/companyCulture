'use strict';

angular.module('companyCultureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        controllerAs: 'Group'
      })
      .state('groupPage', {
        url:'/group/:id',
        templateUrl:'app/group/groupPage.html',
        controller: 'GroupCtrl',
        controllerAs: 'Group'
      })
  });