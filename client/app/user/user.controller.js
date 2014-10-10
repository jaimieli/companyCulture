'use strict';

angular.module('companyCultureApp')
  .controller('UserCtrl', function ($scope, $http, Auth) {
    $scope.message = 'Hello';

    var questionsArr = "";

    $http.get('/api/questions').success(function(questionsArr) {
         $scope.questionsArr = questionsArr;
         console.log(questionsArr);
     });

    $scope.currentUserId = Auth.getCurrentUser();

    $scope.userAnswer = function() {
      console.log("does it get here?");
      $http.post('/api/groups', { "AnswerSchema.answer": $scope.userAnswer });
    };
  });
