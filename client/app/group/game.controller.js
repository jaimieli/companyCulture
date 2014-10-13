'use strict';

angular.module('companyCultureApp')
  .controller('GameController', function ($scope, $http, $interval, scoreFactory, $rootScope) {

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
    // $http.get('/api/questions').success(function(questionsArray) {
    //   $scope.questionsArray = questionsArray;
    // });
    var shuffle = function(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    // when the group data is retrieved on load, execute this function
    $rootScope.$on('data is ready', function(event, data){
      console.log('in game controller after data is ready')
      $scope.currentQuestionData = data;
      console.log('$scope.currentQuestionData in game controller ', $scope.currentQuestionData);
      if ($scope.currentQuestionData.answersArray.length > 1) {
         for(var i = 0; i < $scope.currentQuestionData.answersArray.length; i++){
              $scope.users.push($scope.currentQuestionData.answersArray[i].user);
              $scope.blanks.push( {
                answer: $scope.currentQuestionData.answersArray[i].answer,
                // user: $scope.currentQuestionData.answersArray[i].user
                });
              $scope.bottomArr.push({
                answer: $scope.currentQuestionData.answersArray[i].answer,
                // user: $scope.currentQuestionData.answersArray[i].user
              });
              $scope.correctOrder.push({
                answer: $scope.currentQuestionData.answersArray[i].answer,
                user: $scope.currentQuestionData.answersArray[i].user
              })
          };
        console.log('$scope.users: ', $scope.users)
        console.log('$scope.blanks: ', $scope.blanks)
        console.log('$scope.bottomArr: ', $scope.bottomArr)
        console.log('$scope.correctOrder: ', $scope.correctOrder)
        $scope.users = shuffle($scope.users);

        // order type only
        if($scope.currentQuestionData.questionType=== "Order"){
          console.log("its an order q");
          $scope.blanks.sort(function(obj1,obj2){return obj1.answer - obj2.answer});
          $scope.bottomArr.sort(function(obj1,obj2){return obj1.answer- obj2.answer});
          $scope.correctOrder.sort(function(obj1,obj2){return obj1.answer- obj2.answer});
        }

        // sort type only
        if($scope.currentQuestionData.questionType==="Sort"){
          console.log('sort type');
            for(var q = 0; q < $scope.currentQuestionData.answersArray.length; q++){
              if($scope.currentQuestionData.answersArray[q].answer === $scope.currentQuestionData.questionOption.optionA){
                $scope.sortArrayA.push({user: $scope.currentQuestionData.answersArray[q].user.name});
                $scope.sortAnsA.push({answer: $scope.currentQuestionData.answersArray[q].answer});
              }else{
                $scope.sortArrayB.push({user: $scope.currentQuestionData.answersArray[q].user.name});
                $scope.sortAnsB.push({answer: $scope.currentQuestionData.answersArray[q].answer});
              }
            }
        }
        console.log('$scope.sortArrayA: ', $scope.sortArrayA);
        console.log('$scope.sortAnsA: ', $scope.sortAnsA);

      } else {
        console.log('answers array does not have more than one answer');
      }

    })

     $scope.users = [];
     $scope.blanks = [];
     $scope.answers = [];
     $scope.grabbed = "";
     $scope.dropped = "";
     $scope.bottomArr = [];
     $scope.correctOrder = [];
     $scope.sortArrayA = [];
     $scope.sortArrayB = [];
     $scope.sortAnsB = [];
     $scope.sortAnsA = [];

     $scope.grabbedItem = function(event, ui, grabbedItem) {
      $scope.grabbed = grabbedItem;
     };
     $scope.droppedItem = function(event, ui, droppedItem, index){
      $scope.dropped = $scope.grabbed;
      $scope.checkDiff();
      $scope.checkAnswer();
     };
     // $scope.clearItem = function(event, ui, clearedItem, index) {
     //  delete $scope.bottomArr[index].user.name;
     // };
     $scope.checkDiff = function() {
      for (var i = 0; i < $scope.blanks.length; i++){
        if($scope.blanks[i].name){
          $scope.bottomArr[i].name = $scope.blanks[i].name;
        }else{
          delete $scope.bottomArr[i].name;
        };
      }
     };
     $scope.userAnswered = function(){
      var currentQuestionId = $scope.groupData.questionsArr[$scope.groupData.questionsArr.length - 1]._id;
      $http.get('/api/questions/' + currentQuestionId + '/userCompleted').success(function(data){
        console.log('question obj after user plays game: ', data);
        // Don't update scope variables until after modal pops up, etc
        // $rootScope.$emit('update group data')
      })
     }
     $scope.checkAnswer = function(){
      var correctCounter = 0;
      // check answer for Match
      if($scope.currentQuestionData.questionType === 'Match') {
        $scope.right = [];
        for(var x = 0; x < $scope.bottomArr.length; x++) {
          console.log($scope.currentQuestionData.answersArray)
          if($scope.bottomArr[x].name === $scope.currentQuestionData.answersArray[x].user.name) {
            $scope.right.push("success");
            correctCounter++;
          }else{
             $scope.right.push("danger");
          }
        }
        if(correctCounter == $scope.bottomArr.length){
          console.log("got it all");
          $scope.$broadcast('timer-stop');
          //modal pop up with elapsed time and buttons to go to leader boards
          $scope.userAnswered();
        };
      } else if ($scope.currentQuestionData.questionType === 'Order') {
        $scope.right = [];
        console.log($scope.correctOrder);
        for(var x = 0; x < $scope.bottomArr.length; x++) {
          if($scope.bottomArr[x].name === $scope.correctOrder[x].user.name) {
            $scope.right.push("success");
            correctCounter++;
          }else{
             $scope.right.push("danger");
          }
        }
        if(correctCounter == $scope.bottomArr.length){
            console.log("got it all");
            $scope.$broadcast('timer-stop');
            //modal pop up with elapsed time and buttons to go to leader boards
            $scope.userAnswered();
        };
      } else if ($scope.currentQuestionData.questionType === "Sort"){
        $scope.rightA = [];
        $scope.rightB = [];

        for(var x = 0; x < $scope.sortArrayA.length; x++) {
            console.log('$scope.sortArray[x]: ', $scope.sortArrayA[x])
            console.log('$scope.sortAnsA[x]: ', $scope.sortAnsA[x])
            if($scope.sortArrayA.map(function(e){return e.user;}).indexOf($scope.sortAnsA[x].name)> -1){
              $scope.rightA.push("success");
              correctCounter++;
            }
            else{
              $scope.rightA.push("danger");
            }
        }
        for(var x = 0; x < $scope.sortArrayB.length; x++) {
            if($scope.sortArrayB.map(function(e){return e.user;}).indexOf($scope.sortAnsB[x].name)> -1){
              $scope.rightB.push("success");
              correctCounter++;
            }
            else{
              $scope.rightB.push("danger");
            }
        }
        if(correctCounter === $scope.currentQuestionData.answersArray.length){
          console.log("got it all");
          $scope.$broadcast('timer-stop');
          $scope.userAnswered();
        }
      }
     };
     $scope.reset = function() {
      console.log('in the reset');
      for(var t = 0; t < $scope.bottomArr.length; t++) {
        delete $scope.bottomArr[t].name;
        delete $scope.blanks[t].name;
         $scope.users[t] = $scope.currentQuestionData.answersArray[t].user;
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
