'use strict';

angular.module('companyCultureApp')
  .controller('UserCtrl', function ($scope, $http, $cookies) {
    $http.get('/api/users/getGroups').success(function(data){
      console.log(data);
      $scope.currentUser = data;
    });
    $scope.cookieId = $cookies.inviteUserToGroup;
    // add user to cookies group and update user by adding group to groups
    $http.get('/api/groups/addInvitee/' + $scope.cookieId).success(function(data){
      console.log('after adding invitee to group: ', data);
    })
    // var groupObj = {
    //   invited: [{
    //     name: '', // get this with auth in the backend
    //     email: '', // get this with auth in the backend
    //     confirmed: true // changed confirmed from false to true
    //   }], // do this here? modify the object
    //   users: [] // do this in the backend using add to set and auth
    // }

    // $http.put('/api/groups/' + $scope.cookieId, )
    $scope.message = 'Hello';
  });
