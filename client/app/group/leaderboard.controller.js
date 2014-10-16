'use strict';

angular.module('companyCultureApp')
  .controller('LeaderboardController', function($scope, $rootScope, $http){
    console.log('leaderboard controller')
    var self = this;

    // currentQuestion data
    $rootScope.$on('data is ready', function(event, data){
      console.log('data is ready in leaderboard controller');
      $scope.currentQuestionData = data;
      console.log('$scope.currentQuestionData in leaderboard: ', $scope.currentQuestionData);
      if ($scope.currentQuestionData.active) {
        self.leaderboardText = 'Current';
      } else {
        self.leaderboardText = 'Last'
      }
      // get gameTimes for all users who have completed the game
      // var answersArr = $scope.currentQuestionData.answersArray;
      // for(var i = 0; i < answersArr.length; i ++) {
      //   if(answersArr[i].completed === true) {
      //     console.log('user completed game')
      //   }
      // }
    })
    // current Group Data
    $rootScope.$on('groupData ready', function(event, data){
      $scope.groupData = data;
      console.log('$scope.groupData in leaderboard: ', $scope.groupData);
    })

    // get current times
  })