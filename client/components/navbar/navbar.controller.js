'use strict';

angular.module('companyCultureApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'User',
      'link': '/user'
    },
    // , {
    //   'title': 'Group',
    //   'link': '/group'
    // }
    // ,{
    //   'title': 'Game',
    //   'link': '/game'
    // },
    {
      'title': 'Create group',
      'link': '/create'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });