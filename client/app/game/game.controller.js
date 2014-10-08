'use strict';

angular.module('companyCultureApp')
  .controller('GameCtrl', function ($scope, $http) {


     $http.get('/api/questions').success(function(questionsArr) {
         $scope.questionsArr = questionsArr;
     });
  });
