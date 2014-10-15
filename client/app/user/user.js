'use strict';

angular.module('companyCultureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'User'
      })
      .state('createGroup',{
      	url: '/create',
      	templateUrl: 'app/user/createGroup.html',
      	controller: 'CreateGroupCtrl',
      	controllerAs: 'Create'
      });
  });
  
