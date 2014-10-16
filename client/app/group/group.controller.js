'use strict';

angular.module('companyCultureApp')
  .controller('GroupCtrl', function ($scope, $stateParams, $http, Auth, $rootScope) {
    $scope.showLeaderboard = false;
    $rootScope.$on('show leaderboard',function(event){
      console.log('catching show leaderboard')
      $scope.showLeaderboard = true;
      console.log('$scope.showLeaderboard in group: ', $scope.showLeaderboard);
    })
    var self = this;
    $scope.currentUser = Auth.getCurrentUser();
    console.log('$scope.currentUser on groupPage load: ', $scope.currentUser);
    $scope.groupId = $stateParams.id;
    console.log('$scope.groupId on groupPage load: ', $scope.groupId);
    // function to determine if the user has an outstanding question (or game <-- later)
    var checkUserAnsweredQuestion = function() {
      console.log('$scope.showQuestion in checkUserAnsweredQuestion function: ', $scope.showQuestion)
      var currentQuestionAnswersArr = $scope.groupData.questionsArr[$scope.groupData.questionsArr.length - 1].answersArray;
      var currentQuestionAnswersArrLen = currentQuestionAnswersArr.length;
      for (var i = 0; i < currentQuestionAnswersArrLen; i++) {
        if(currentQuestionAnswersArr[i].user === $scope.currentUser._id) {
          $scope.showQuestion = false;
          console.log('already completed the most current question, $scope.showQuestion: ', $scope.showQuestion)
        }
      }
    }
    var checkUserCompletedGame = function(){
      console.log('checking if user completed game');
      $scope.showGame = false;
      console.log('$scope.showGame before if: ', $scope.showGame);
      if ($scope.showQuestion = false) {
        $scope.showGame = true;
        console.log('$scope.showGame when showQuestion is false: ', $scope.showGame)
          var len = $scope.currentQuestionData.answersArray.length;
          for (var i = 0; i < len; i++) {
            if ($scope.currentQuestionData.answersArray[i].user._id === $scope.currentUser._id) {
              if($scope.currentQuestionData.answersArray[i].completed === true) {
                $scope.showGame = false;
                console.log('already completed most recent game, $scope.showGame: ', $scope.showGame);
                return;
              }
            }
          }
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