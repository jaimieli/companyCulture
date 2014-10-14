'use strict';

angular.module('companyCultureApp')
  .controller('UserCtrl', function ($scope, $http, $cookies, userGroup) {
    // listening for new group created
    $scope.$on('new group created', function(event) {
      $http.get('/api/users/getGroups').success(function(data){
        console.log(data);
        $scope.currentUser = data;
      });
    });
    // if cookieId, then add user to group and update user by adding group to groups
    $scope.cookieId = $cookies.inviteUserToGroup;
    if ($cookies.inviteUserToGroup !== undefined && $cookies.inviteUserToGroup !== 'undefined') {
      console.log('cookies inside if statement should not be undefined: ', $cookies.inviteUserToGroup)
      $http.get('/api/groups/addInvitee/' + $scope.cookieId).success(function(data){
        console.log('after adding invitee to group: ', data);
        $http.get('/api/users/getGroups').success(function(data){
          console.log(data);
          $scope.currentUser = data;
        });
      })
    } else {
      $http.get('/api/users/getGroups').success(function(data){
        console.log(data);
        $scope.currentUser = data;
      });
    }

    var questionsArr = "";

    $http.get('/api/questions').success(function(questionsArr) {
         $scope.questionsArr = questionsArr;
         console.log(questionsArr);
     });

    $scope.userAnswer = function() {
      console.log("does it get here?");
      $http.post('/api/groups', { "AnswerSchema.answer": $scope.userAnswer });
    };

  });
