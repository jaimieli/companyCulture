'use strict';

angular.module('companyCultureApp')
  .controller('GameCtrl', function ($scope, $http, $interval, scoreFactory) {
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
       for(var i = 0; i < groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr.length; i++){
            var obj = {user: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].user};
            $scope.users.push(obj);
            $scope.blanks.push({answer: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].answer});
            $scope.bottomArr.push({answer: groupData[groupData.length-1].questionsArr[groupData[groupData.length-1].questionsArr.length-1].answersArr[i].answer});
        };
        $scope.users = shuffle($scope.users);
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
     };
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
      $scope.right = [];
      for(var x = 0; x < $scope.bottomArr.length; x++) {
        if($scope.bottomArr[x].user === $scope.groupData[$scope.groupData.length-1].questionsArr[$scope.groupData[$scope.groupData.length-1].questionsArr.length-1].answersArr[x].user) {
          $scope.right.push("success");
        }else{
           $scope.right.push("danger");
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



















