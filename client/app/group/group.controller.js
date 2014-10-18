'use strict';

angular.module('companyCultureApp')
  .controller('GroupCtrl', function ($scope, $stateParams, $http, Auth, $rootScope, async) {
    var self = this;
    $scope.currentUser = Auth.getCurrentUser();
    console.log('$scope.currentUser on groupPage load: ', $scope.currentUser);
    $scope.groupId = $stateParams.id;
    console.log('$scope.groupId on groupPage load: ', $scope.groupId);
    // initially hide leaderboard
    $scope.showLeaderboard = true;
    // toggle leaderboard button
    this.leaderboardButtonText = 'Show Leaderboard'
    this.showLeaderboardFunc = function(){
      // if (!$scope.showLeaderboard) {
      //   $scope.showLeaderboard = true;
      //   this.leaderboardButtonText = 'Hide Leaderboard'
      // } else {
      //   $scope.showLeaderboard = false;
      //   this.leaderboardButtonText = 'Show Leaderboard'
      // }
    }
    // catches event emitted from leaderboard button in the after game score modal
    $rootScope.$on('show leaderboard', function(event){
      $scope.showLeaderboard = true;
      self.leaderboardButtonText = 'Hide Leaderboard'
    })
    // function to determine if the user has answered current question
    var checkUserAnsweredQuestion = function() {
      $scope.showQuestion = true;
      console.log('in checkUserAnsweredQuestion function')
      var currentQuestionAnswersArr = $scope.groupData.questionsArr[$scope.groupData.questionsArr.length - 1].answersArray;
      var currentQuestionAnswersArrLen = currentQuestionAnswersArr.length;
      for (var i = 0; i < currentQuestionAnswersArrLen; i++) {
        if(currentQuestionAnswersArr[i].user === $scope.currentUser._id) {
          console.log('already completed the most current question')
          $scope.showQuestion = false;
        }
      }
    }
    // function to determine if the user has played current game
    var checkUserCompletedGame = function(){
      console.log('checking if user completed game');
      $scope.showGame = false;
      // if statement: only users who've completed the question are allowed to see the game
      if($scope.showQuestion === false) {
        $scope.showGame = true;
        console.log('inside check game, $scope.showQuestion: ', $scope.showQuestion);
        var len = $scope.currentQuestionData.answersArray.length;
        var checkOneUser = function(answer, callback) {
          if (answer.user._id === $scope.currentUser._id) {
            if(answer.completed === true) {
              console.log('already completed most recent game');
              $scope.showGame = false;
              callback();
            } else {
            callback();
            }
          } else {
            callback();
          }
        }

        var doneCheckingUsers = function(err) {
          if (err) {console.log(err)};
          // function to determine if all users have played current game
          for (var i = 0; i < $scope.currentQuestionData.answersArray.length; i++){
            if ($scope.currentQuestionData.answersArray[i].completed === false) {
              console.log('not everyone has completed the game');
              return;
            }
          }
          if ($scope.currentQuestionData.activeGame === true) {
            console.log('everyone has completed the game so ending game')
            $rootScope.$emit('everyone has completed the game');
          }
          return;
        }
        async.each($scope.currentQuestionData.answersArray, checkOneUser, doneCheckingUsers)
      }
    }

    $http.get('/api/groups/'+$scope.groupId).success(function(data){
      $scope.groupData = data;
      console.log('$scope.groupData on groupPage load: ', $scope.groupData);
      $rootScope.$emit('groupData ready', data);
      // if there's a question
      if(data.questionsArr.length > 0) {
        $scope.questionsExist = true;
        console.log('$scope.questionsExist: ', $scope.questionsExist)
        var currentQuestionId = data.questionsArr[data.questionsArr.length - 1]._id;
        console.log('currentQuestionId: ', currentQuestionId);
        $http.get('/api/questions/' + currentQuestionId).success(function(data){
          $scope.currentQuestionData = data;
          checkUserAnsweredQuestion();
          checkUserCompletedGame();
          $rootScope.$emit('data is ready', data);
        })
      } else {
        $scope.questionsExist = false;
        console.log('$scope.questionsExist: ', $scope.questionsExist)
      }
      // determine if the user is the admin of the group
      if(data.admin === Auth.getCurrentUser()._id) {
        self.isGroupAdmin = true;
        console.log('admin of the group');
        $rootScope.$emit('is groupAdmin')
      }
    })

    // updates scope.groupdata + scope.currentQuestionData
    $rootScope.$on('update group data', function(event){
      $http.get('/api/groups/'+$scope.groupId).success(function(data){
        $scope.groupData = data;
        console.log('$scope.groupData after some change to the group: ', $scope.groupData);
        $rootScope.$emit('groupData ready', data);
        if(data.questionsArr.length > 0) {
          var currentQuestionId = data.questionsArr[data.questionsArr.length - 1]._id;
          $scope.questionsExist = true;
          console.log('$scope.questionsExist: ', $scope.questionsExist)
          var currentQuestionId = data.questionsArr[data.questionsArr.length - 1]._id;
          console.log('currentQuestionId: ', currentQuestionId);
          $http.get('/api/questions/' + currentQuestionId).success(function(data){
            $scope.currentQuestionData = data;
            checkUserAnsweredQuestion();
            checkUserCompletedGame();
            $rootScope.$emit('data is ready', data);
          })
        } else {
          $scope.questionsExist = false;
          console.log('$scope.questionsExist: ', $scope.questionsExist)
        }
      });
    });
  });