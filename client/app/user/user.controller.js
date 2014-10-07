'use strict';

angular.module('companyCultureApp')
  .controller('UserCtrl', function ($scope, $http) {
    $scope.message = 'Hello';

    var questionsArr = "";

    $http.get('/api/questions').success(function(questionsArr) {
         $scope.questionsArr = questionsArr;
         console.log(questionsArr);
     });

  });
