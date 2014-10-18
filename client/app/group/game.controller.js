'use strict';

angular.module('companyCultureApp')
.controller('GameController', function ($scope, $http, $interval, scoreFactory, $rootScope, $modal, $log, Auth) {
    // TIMER
    $scope.score = 0;
    $scope.timerSeconds = 0;
    $scope.interval = 0;
    $scope.clickedPlay = false;

    $scope.play = function() {
      console.log('trying to play game');
      $scope.$broadcast('timer-start');
      $scope.clickedPlay = true;
      $scope.$on('timer-tick', function(event, value) {
        $scope.timerSeconds = 60 - (Math.floor(value.millis / 1000)) % 100;
        if($scope.timerSeconds === 0){
          $scope.$broadcast('timer-stop');
          console.log("time up!");
        }
      });
      $interval(function() {
        $scope.interval = ($scope.interval + 1) % 100;
      }, 1000);
    }

    $scope.$on('timer-stopped', function (event, data){
      // added if statement so that the modal doesn't pop up if you're not playing the game

        scoreFactory.setScore(Math.floor(data.millis/1000));
        $scope.userScore = scoreFactory.getScore();
        var bestTime;
        var usersArr = $scope.groupData.users;
        for (var i = 0; i < usersArr.length; i++) {
          if(usersArr[i].user._id === $scope.currentUser._id) {
            console.log('found user, checking best time')
            bestTime = usersArr[i].bestTime;
            $scope.open('afterGameContent.html');
          }


      }
      // save current game score
      $http.post('/api/questions/' + $scope.currentQuestionData._id + '/saveScore', {score: $scope.userScore}).success(function(data){
        console.log('data after saving score: ', data);
        // if best time is null or the currentScore is better than best time, we need to update
        if(!bestTime || $scope.userScore < bestTime) {
          console.log('make call to back end to update bestTime in group obj');
          $http.post('/api/groups/' + $scope.groupData._id + '/updateBestTime', {score: $scope.userScore}).success(function(data){
            console.log('group data after updating best time: ', data);
          })
        }
      })
    });

    var shuffle = function(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    // when the group data is retrieved on load, execute this function
    $rootScope.$on('data is ready', function(event, data){
      // reset all the variables
      $scope.users = [];
      $scope.usersUntouched = [];
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
      $scope.tempArr = [];
      $scope.sliced =  '';

      // console.log('in game controller after data is ready')
      $scope.currentQuestionData = data;
      console.log('$scope.currentQuestionData in game controller ', $scope.currentQuestionData);
      console.log("qarray:",$scope.currentQuestionData.answersArray);
      //checking how long answer array is. if more than 6 use 6. if less than 6 user answerarr length
      if ($scope.currentQuestionData.answersArray.length > 1){
          var lengthToUse = 0;
          if($scope.currentQuestionData.answersArray.length>1 && $scope.currentQuestionData.answersArray.length<6){
              lengthToUse = $scope.currentQuestionData.answersArray.length;
          }else{
              lengthToUse = 6;
          }
           console.log(lengthToUse);
           // $scope.tempArr = $scope.currentQuestionData.answersArray;
           //setting pushing data in answersArray to tempArr
           for(var i = 0; i < $scope.currentQuestionData.answersArray.length; i++){
            $scope.tempArr.push($scope.currentQuestionData.answersArray[i]);
           }
           console.log("tempArr", $scope.tempArr);
           //when q is order or match, splice temparr and push data in to users, blanks, bottomArr, and correctOrder array
          if($scope.currentQuestionData.questionType=== "Order" || $scope.currentQuestionData.questionType=== "Match"){
            for(var i = 0; i < lengthToUse; i++){
              //choose random number and use that number as index to splice tempArr
              $scope.spliced = $scope.tempArr.splice(Math.floor(Math.random()*($scope.tempArr.length)),1);
              console.log($scope.spliced[$scope.spliced.length-1].user.name);
              //push specific attribute to necessary arrays for the game
              $scope.users.push($scope.spliced[$scope.spliced.length-1].user);
              $scope.usersUntouched.push($scope.spliced[$scope.spliced.length-1].user);
              $scope.blanks.push({answer: $scope.spliced[$scope.spliced.length-1].answer});
              $scope.bottomArr.push({answer: $scope.spliced[$scope.spliced.length-1].answer});
              $scope.correctOrder.push({answer: $scope.spliced[$scope.spliced.length-1].answer, user: $scope.spliced[$scope.spliced.length-1].user.name});
            };
            //shuffle users
            $scope.users = shuffle($scope.users);
            if($scope.currentQuestionData.questionType=== "Order"){
              // console.log("its an order q");
              //ordering answers in correct order
              $scope.blanks.sort(function(obj1,obj2){return obj1.answer - obj2.answer});
              $scope.bottomArr.sort(function(obj1,obj2){return obj1.answer- obj2.answer});
              $scope.correctOrder.sort(function(obj1,obj2){return obj1.answer- obj2.answer});
            };
            console.log("scope.users", $scope.users);
            console.log("scope.blanks - holds answer", $scope.blanks);
            console.log("scope.bottomArr - holds answer", $scope.bottomArr);
            console.log("scope.correctOrder - answer and user", $scope.correctOrder);
            // console.log("scope.users", $scope.users);
            //when q is sort type, splice tempArr then if splice is optionA push to sortArrayA and sortAnsA, samething for optionB
          }else if ($scope.currentQuestionData.questionType==="Sort"){
            for(var i = 0; i < lengthToUse; i++){
               //choose random number and use that number as index to splice tempArr
              $scope.spliced = $scope.tempArr.splice(Math.floor(Math.random()*($scope.tempArr.length)),1);
              //push specific attribute to necessary arrays for the game
              $scope.users.push($scope.spliced[$scope.spliced.length-1].user);
              $scope.correctOrder.push({answer: $scope.spliced[$scope.spliced.length-1].answer, user: $scope.spliced[$scope.spliced.length-1].user.name});
              $scope.usersUntouched.push($scope.spliced[$scope.spliced.length-1].user);
              //check if answer is optionA or optionB and push to array accordingly
              if($scope.spliced[$scope.spliced.length-1].answer === $scope.currentQuestionData.questionOption.optionA){
                $scope.sortArrayA.push({user: $scope.spliced[$scope.spliced.length-1].user.name});
                $scope.sortAnsA.push({answer: $scope.spliced[$scope.spliced.length-1].answer});
              }else{
                $scope.sortArrayB.push({user: $scope.spliced[$scope.spliced.length-1].user.name});
                $scope.sortAnsB.push({answer: $scope.spliced[$scope.spliced.length-1].answer});
              }
            }
          }
          console.log("scope.sortArrayA - user", $scope.sortArrayA);
          console.log("scope.sortAnsA - answer", $scope.sortAnsA);
          console.log("scope.sortArrayB - user", $scope.sortArrayB);
          console.log("scope.sortAnsB - answer", $scope.sortAnsB);
          console.log("after qarray:",$scope.currentQuestionData.answersArray);
      }

      // if ($scope.currentQuestionData.answersArray.length > 1){
      //    for(var i = 0; i < $scope.currentQuestionData.answersArray.length; i++){
      //         $scope.users.push($scope.currentQuestionData.answersArray[i].user);
      //         $scope.blanks.push( {
      //           answer: $scope.currentQuestionData.answersArray[i].answer
      //           // user: $scope.currentQuestionData.answersArray[i].user
      //           });
      //         $scope.bottomArr.push({
      //           answer: $scope.currentQuestionData.answersArray[i].answer
      //           // user: $scope.currentQuestionData.answersArray[i].user
      //         });
      //         $scope.correctOrder.push({
      //           answer: $scope.currentQuestionData.answersArray[i].answer,
      //           user: $scope.currentQuestionData.answersArray[i].user
      //         })
      //     };
      //   // console.log('$scope.users: ', $scope.users)
      //   // console.log('$scope.blanks: ', $scope.blanks)
      //   // console.log('$scope.bottomArr: ', $scope.bottomArr)
      //   // console.log('$scope.correctOrder: ', $scope.correctOrder)
      //   $scope.users = shuffle($scope.users);

      //   // order type only
      //   if($scope.currentQuestionData.questionType=== "Order"){
      //     // console.log("its an order q");
      //     $scope.blanks.sort(function(obj1,obj2){return obj1.answer - obj2.answer});
      //     $scope.bottomArr.sort(function(obj1,obj2){return obj1.answer- obj2.answer});
      //     $scope.correctOrder.sort(function(obj1,obj2){return obj1.answer- obj2.answer});
      //   }

      //   // sort type only
      //   if($scope.currentQuestionData.questionType==="Sort"){
      //     // console.log('sort type');
      //       for(var q = 0; q < $scope.currentQuestionData.answersArray.length; q++){
      //         if($scope.currentQuestionData.answersArray[q].answer === $scope.currentQuestionData.questionOption.optionA){
      //           $scope.sortArrayA.push({user: $scope.currentQuestionData.answersArray[q].user.name});
      //           $scope.sortAnsA.push({answer: $scope.currentQuestionData.answersArray[q].answer});
      //         }else{
      //           $scope.sortArrayB.push({user: $scope.currentQuestionData.answersArray[q].user.name});
      //           $scope.sortAnsB.push({answer: $scope.currentQuestionData.answersArray[q].answer});
      //         }
      //       }
      //   }
      //   // console.log('$scope.sortArrayA: ', $scope.sortArrayA);
      //   // console.log('$scope.sortAnsA: ', $scope.sortAnsA);

      // } else {
      //   // console.log('answers array does not have more than one answer');
      // }
    });

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
     $scope.tempArr = [];

     //what was grabbed in the game
     $scope.grabbedItem = function(event, ui, grabbedItem) {
      $scope.grabbed = grabbedItem;
     };
     //what was dropped in the game
     //when something is dropped - calls functions to check if answer is correct.
     $scope.droppedItem = function(event, ui, droppedItem, index){
      $scope.dropped = $scope.grabbed;
      $scope.checkDiff();
      $scope.checkAnswer();
      console.log($scope.bottomArr);
     };
     //makes sure blanks and bottomArr have same values.
     $scope.checkDiff = function() {
      for (var i = 0; i < $scope.blanks.length; i++){
        if($scope.blanks[i].name){
          $scope.bottomArr[i].name = $scope.blanks[i].name;
        }else{
          delete $scope.bottomArr[i].name;
        };
      }
     };


     $scope.checkAnswer = function(){
      var correctCounter = 0;
      // check answer for Match
      console.log("checking answer");
      if($scope.currentQuestionData.questionType === 'Match') {
        //right array contains color. this is used to change option green and red depending on if the dropped item is the correct one or not.
        $scope.right = [];
        for(var x = 0; x < $scope.bottomArr.length; x++) {
          // console.log($scope.currentQuestionData.answersArray)
          console.log($scope.bottomArr[x].name);
          console.log($scope.correctOrder[x].user);
          //correct if name in bottomArr at index equals name in correctOrder at the same index
          if($scope.bottomArr[x].name === $scope.correctOrder[x].user) {
            console.log("pushed green!");
            $scope.right.push("green");
            correctCounter++;
            console.log("its a match!")
          }else{
             $scope.right.push("red");
             console.log("wrong, you suck");
          }
        }
        if(correctCounter == $scope.bottomArr.length){
          console.log("got it all");
          $scope.$broadcast('timer-stop');
          //modal pop up with elapsed time and buttons to go to leader boards
          // $scope.open('afterGameContent.html');
        };
        //check answer for Order
      } else if ($scope.currentQuestionData.questionType === 'Order') {
        $scope.right = [];
        console.log($scope.correctOrder);
        for(var x = 0; x < $scope.bottomArr.length; x++) {
          //correct if name in bottomArr at index equals name in correctOrder at the same index
          if($scope.bottomArr[x].name === $scope.correctOrder[x].user) {
            $scope.right.push("green");
            correctCounter++;
          }else{
             $scope.right.push("red");
          }
        }
        if(correctCounter == $scope.bottomArr.length){
            console.log("got it all");
            $scope.$broadcast('timer-stop');
            //modal pop up with elapsed time and buttons to go to leader boards
            // $scope.open('afterGameContent.html');

        };
      } else if ($scope.currentQuestionData.questionType === "Sort"){
        $scope.rightA = [];
        $scope.rightB = [];

        for(var x = 0; x < $scope.sortArrayA.length; x++) {
            // console.log('$scope.sortArray[x]: ', $scope.sortArrayA[x])
            // console.log('$scope.sortAnsA[x]: ', $scope.sortAnsA[x])
            //if name in sortAnsA exists in sortArrayA, the drop is considered correct
            if($scope.sortArrayA.map(function(e){return e.user;}).indexOf($scope.sortAnsA[x].name)> -1){
              $scope.rightA.push("green");
              correctCounter++;
            }
            else{
              $scope.rightA.push("red");
            }
        }
        for(var x = 0; x < $scope.sortArrayB.length; x++) {
            //if name in sortAnsB exists in sortArrayB, the drop is considered correct
            if($scope.sortArrayB.map(function(e){return e.user;}).indexOf($scope.sortAnsB[x].name)> -1){
              $scope.rightB.push("green");
              correctCounter++;
            }
            else{
              $scope.rightB.push("red");
            }
        }
        if(correctCounter === $scope.correctOrder.length){
          console.log("got it all");
          $scope.$broadcast('timer-stop');
          //modal pop up with elapsed time and buttons to go to leader boards
          // $scope.open('afterGameContent.html');
        }
      }
     };
     $scope.reset = function() {
      console.log('in the reset');
      $scope.blanks = [];
      $scope.users = [];
      for(var t = 0; t < $scope.bottomArr.length; t++) {
        delete $scope.bottomArr[t].name;
        $scope.blanks.push({answer : $scope.bottomArr[t].answer});
        // console.log("untouched[t]:",$scope.usersUntouched[t]);
        $scope.users.push($scope.usersUntouched[t]);
        // console.log("users[t]:", $scope.users[t]);
        // $scope.users[t].user = $scope.correctOrder[t].user);
        // $scope.users[t] = $scope.currentQuestionData.answersArray[t].user;
      }
      console.log('usersUntouched', $scope.usersUntouched);
      console.log("scopeuser:",$scope.users);
      console.log("blanks:",$scope.blanks);
      console.log("bottomArr:",$scope.bottomArr);

      if($scope.currentQuestionData.questionType === "Sort"){
        $scope.sortAnsA = [];
        $scope.sortAnsB = [];
        $scope.sortArrayA = [];
        $scope.sortArrayB = [];
        for(var q = 0; q < $scope.correctOrder.length; q++){
          $scope.users.push($scope.usersUntouched[q]);
          if($scope.correctOrder[q].answer === $scope.currentQuestionData.questionOption.optionA){
            $scope.sortAnsA.push({answer: $scope.correctOrder[q].answer});
            $scope.sortArrayA.push({user: $scope.correctOrder[q].user});
            console.log("detected optionA so pushing to sortAnsA");
            console.log("sortAnsA",$scope.sortAnsA);
            console.log("sortArrayA",$scope.sortArrayA);
          }else{
            $scope.sortAnsB.push({answer: $scope.correctOrder[q].answer});
            $scope.sortArrayB.push({user: $scope.correctOrder[q].user});
            console.log("detected optionB so pushing to sortAnsB");
            console.log("sortAnsB",$scope.sortAnsB);
            console.log("sortArrayB",$scope.sortArrayB);
          }
        }
        // $scope.sortArrayA = shuffle($scope.sortArrayA);
        // $scope.sortArrayB = shuffle($scope.sortArrayB);
      }
      $scope.users = shuffle($scope.users);
    };

     $scope.open = function (templateUrl) {
      var modalInstance = $modal.open({
          templateUrl: 'afterGameContent.html',
          controller: 'AfterGameModalInstanceCtrl',
          backdrop: 'static',
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
     }
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
})
.controller('AfterGameModalInstanceCtrl', function($scope, $modalInstance, $http, Auth, scoreFactory, $rootScope) {
  $scope.userScore = scoreFactory.getScore();
  $scope.showLeaderboardFunc = function() {
    console.log('trying to show leadderboard');
    $modalInstance.dismiss('cancel');
    $rootScope.$emit('update group data');
    $rootScope.$emit('show leaderboard');
  }
  $scope.ok = function () {
  };
});



