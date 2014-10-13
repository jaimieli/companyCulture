'use strict';

angular.module('companyCultureApp')
  .controller('GameCtrl', function ($scope, $http, $interval, scoreFactory) {

   $http.get('/api/questions').success(function(questionsArr) {
       $scope.questionsArr = questionsArr;
    });

    // TIMER
    $scope.score = 0;
    $scope.timerSeconds = 0;
    $scope.$on('timer-tick', function(event, value) {
      $scope.timerSeconds = 90 - (Math.floor(value.millis / 1000)) % 90;
    });
    $scope.interval = 0;
    $interval(function() {
      $scope.interval = ($scope.interval + 1) % 100;
    }, 1000);
    $scope.$on('timer-stopped', function (event, data){
      scoreFactory.setScore(Math.floor(data.millis/1000));
    });

    // REQUESTS FOR DATA FROM SEED
    $http.get('/api/questions').success(function(questionsArray) {
      $scope.questionsArray = questionsArray;
    });
    var shuffle = function(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };
     $http.get('/api/groups').success(function(groupData) {
       $scope.groupData = groupData;
       console.log(groupData);
       for(var i = 0; i < groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr.length; i++){
            var obj = {user: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].user};
            $scope.users.push(obj);
            $scope.blanks.push({answer: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].answer});
            $scope.bottomArr.push({answer: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].answer});
        };
        $scope.users = shuffle($scope.users);

        // console.log($scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr.length);
        // console.log($scope.questionsArr[$scope.questionsArr.length-1].questionOption.optionA);
          if($scope.questionsArr[$scope.questionsArr.length-1].questionType==="Sort"){
              for(var q = 0; q < $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr.length; q++){
                if($scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].answer === $scope.questionsArr[$scope.questionsArr.length-1].questionOption.optionA){
                  $scope.sortArrayA.push({user: $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].user});
                  $scope.sortAnsA.push({asnwer: $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].answer});
                  $scope.sortAnsA2.push({asnwer: $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].answer});
                }else{
                  $scope.sortArrayB.push({user: $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].user});
                  $scope.sortAnsB.push({answer: $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].answer});
                  $scope.sortAnsB2.push({asnwer: $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[q].answer});
                }
              }
          }
     });

    


     $scope.users = [];
     $scope.blanks = [];
     $scope.answers = [];
     $scope.grabbed = "";
     $scope.dropped = "";
     $scope.bottomArr = [];
     $scope.sortArrayA = [];
     $scope.sortArrayB = [];
     $scope.sortAnsA = [];
     $scope.sortAnsB =[];
     $scope.sortAnsA2 = [];
     $scope.sortAnsB2 = [];



     $scope.grabbedItem = function(event, ui, grabbedItem) {
      $scope.grabbed = grabbedItem;
     };
     $scope.droppedItem = function(event, ui, droppedItem, index){
      $scope.dropped = $scope.grabbed;
      $scope.checkDiff();
      $scope.checkAnswer();
     };
     $scope.clearItem = function(event, ui, clearedItem, index) {
      delete $scope.bottomArr[index].user;
     };
     $scope.checkDiff = function() {

      if($scope.questionsArr[$scope.questionsArr.length-1].questionType === "Order" || $scope.questionsArr[$scope.questionsArr.length-1].questionType === "Match" ){

        for (var i = 0; i < $scope.blanks.length; i++){
          if($scope.blanks[i].user){
            $scope.bottomArr[i].user = $scope.blanks[i].user;
          }else{
            delete $scope.bottomArr[i].user;
          };
        }
       } 
      // else {
      
      //   for(var i = 0; i < $scope.sortArrayA.length; i++){
      //     if($scope.sortAnsA[i].user){
      //       $scope.sortAnsA2[i].user = $scope.sortAnsA[i].user;
      //     }else{
      //       if($scope.sortAnsA2[i].user){
      //         delete $scope.sortAnsA2[i].user;
      //       }
      //     }
      //   }
      //   for(var i = 0; i < $scope.sortArrayB.length; i++){
      //     if($scope.sortAnsB[i].user){
      //       $scope.sortAnsB2[i].user = $scope.sortAnsB[i].user;
      //     } else{
      //       if($scope.sortAnsB2[i].user){
      //         delete $scope.sortAnsB2[i].user;
      //       }
      //     }
      //   }
      // }



     };


     $scope.checkAnswer = function(){

      if($scope.questionsArr[$scope.questionsArr.length-1].questionType === "Order" || $scope.questionsArr[$scope.questionsArr.length-1].questionType === "Match" ){
        $scope.right = [];
        for(var x = 0; x < $scope.bottomArr.length; x++) {
          if($scope.bottomArr[x].user === $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[x].user) {
            $scope.right.push("success");
          }else{
             $scope.right.push("danger");
          }
        }
      }else if ($scope.questionsArr[$scope.questionsArr.length-1].questionType === "Sort"){
        $scope.rightA = [];
        $scope.rightB = [];
        for(var x = 0; x < $scope.sortArrayA.length; x++) {
            if($scope.dropped === $scope.sortArrayA[x].user) {
              $scope.rightA.push("success");
            }else{
               $scope.rightA.push("danger");
            }
        
        }
        for(var x = 0; x < $scope.sortArrayB.length; x++) {
            if($scope.dropped === $scope.sortArrayB[x].user) {
              $scope.rightB.push("success");
            }else{
               $scope.rightB.push("danger");
            }
        }



      }
      
      var correctCounter = 0;
      for(var x = 0; x < $scope.bottomArr.length; x++) {
        if($scope.bottomArr[x].user === $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[x].user) {
          correctCounter++;
        }
      }
      if(correctCounter == $scope.bottomArr.length){
        console.log("got it all");
        $scope.$broadcast('timer-stop');

        //modal pop up with elapsed time and buttons to go to leader boards
      };
     };
     $scope.reset = function() {
      for(var t = 0; t < $scope.bottomArr.length; t++) {
        delete $scope.bottomArr[t].user;
        delete $scope.blanks[t].user;
         $scope.users[t].user = $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[t].user;
      }
      $scope.users = shuffle($scope.users);
    };
  })
.factory('scoreFactory', function() {
  var score;
  return {
    setScore: function(setScore) {
      score = setScore;
    },
    getScore: function() {
      return score;
    }
  }
});

//AFTER TIME IN GAME IS UP OR GAME IS COMPLETED MODAL
var AfterGameModalCtrl = function ($scope, $modal, $log, Auth) {
  $scope.open = function (templateUrl) {
    var modalInstance = $modal.open({
      templateUrl: 'afterGameContent.html',
      controller: 'AfterGameModalInstanceCtrl',
      resolve: {
        currentUserId: function() {
          return $scope.userId;
        },
        currentItemId: function() {
          return $scope.itemId;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};
var AfterGameModalInstanceCtrl = function($scope, $modalInstance, $http, Auth, scoreFactory) {
  $scope.userScore = scoreFactory.getScore();
  $scope.ok = function () {
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
