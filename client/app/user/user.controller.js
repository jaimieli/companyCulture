'use strict';

angular.module('companyCultureApp')
  .controller('UserCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $http.get('/api/users/getGroups').success(function(data){
      console.log(data);
      $scope.currentUser = data;
    })
  });
