'use strict';

angular.module('companyCultureApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $cookies) {
    console.log($location.search());
    $cookies.inviteUserToGroup = $location.search().g;
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to user page
          $location.path('/user');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
