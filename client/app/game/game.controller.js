'use strict';

angular.module('companyCultureApp')
  .controller('GameCtrl', function ($scope, $http) {
     $http.get('/api/questions').success(function(questionsArray) {
         $scope.questionsArray = questionsArray;
     });
     $http.get('/api/groups').success(function(groupData) {
         $scope.groupData = groupData;
         for(var i = 0; i < groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr.length; i++){
           var obj = {user: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].user};
              $scope.users.push(obj);
              $scope.answers.push({});
          };
            console.log($scope.users);
            console.log($scope.answers);
       });
     $scope.random = function() {
      return 0.5 - Math.random();
     };

     $scope.users = [];
     $scope.answers = [];

  });

