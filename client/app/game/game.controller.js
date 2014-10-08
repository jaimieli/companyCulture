'use strict';

angular.module('companyCultureApp')
  .controller('GameCtrl', function ($scope, $http) {
     $http.get('/api/questions').success(function(questionsArray) {
         $scope.questionsArray = questionsArray;
     });
     $http.get('/api/groups').success(function(groupData) {
         $scope.groupData = groupData;
         // console.log("Group Data:", groupData);
         // console.log("QuestionsArr 0: ", groupData[groupData.length-1].questionsArr[0]);
         // console.log("QuestionsArr: ", questionsArr);
     });
     $scope.random = function() {
      return 0.5 - Math.random();
     };
     $scope.list1 = {title: 'AngularJS - Drag Me'};
     $scope.list2 = {};
  });


