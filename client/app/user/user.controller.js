'use strict';

angular.module('companyCultureApp')
  .controller('UserCtrl', function ($scope, $http, $cookies) {
    // listening for new group created
    $scope.$on('new group created', function(event) {
      $http.get('/api/users/getGroups').success(function(data){
        console.log(data);
        $scope.currentUser = data;
      });
    })
    $http.get('/api/users/getGroups').success(function(data){
      console.log(data);
      $scope.currentUser = data;
      // what does this line do? user db is being changed in the backend how do you get it to change on the front end?
    });
    // if cookieId, then add user to group and update user by adding group to groups
    $scope.cookieId = $cookies.inviteUserToGroup;
    if ($cookies.inviteUserToGroup !== undefined && $cookies.inviteUserToGroup !== 'undefined') {
      console.log('cookies inside if statement should not be undefined: ', $cookies.inviteUserToGroup)
      $http.get('/api/groups/addInvitee/' + $scope.cookieId).success(function(data){
        console.log('after adding invitee to group: ', data);
      })
    }
  });
