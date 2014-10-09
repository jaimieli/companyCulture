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
              $scope.blanks.push({answer: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].answer});
              $scope.bottomArr.push({answer: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].answer});
              // $scope.blanks[i].user = (groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].user);
          };
       });

     $scope.users = [];
     $scope.blanks = [];
     $scope.answers = [];
     $scope.grabbed = "";
     $scope.dropped = "";
     $scope.bottomArr = [];

     $scope.grabbedItem = function(event, ui, grabbedItem) {
      $scope.grabbed = grabbedItem;
     };

     $scope.droppedItem = function(event, ui, droppedItem, index){
        $scope.dropped = $scope.grabbed;
        $scope.checkDiff();
        $scope.checkAnswer();
     }

     $scope.clearItem = function(event, ui, clearedItem, index) {
      delete $scope.bottomArr[index].user;
     };

     $scope.checkDiff = function() {
        for (var i = 0; i < $scope.blanks.length; i++){
          if($scope.blanks[i].user){
            $scope.bottomArr[i].user = $scope.blanks[i].user;
          }else{
            delete $scope.bottomArr[i].user;
          };
        }
     };


     $scope.checkAnswer = function(){
     // $scope.shortGroupData = $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1];

      $scope.right = [];

      for(var x = 0; x < $scope.bottomArr.length; x++) {
        if($scope.bottomArr[x].user === $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[x].user) {
          console.log("correct");
          $scope.right.push("success");
        }else{
           $scope.right.push("danger");
        }

      }


     }

     // make a function that takes individual answer as the argument
     // compare it with the actual answer, return true or false
     // based on what it returns, chage the class

  });



















