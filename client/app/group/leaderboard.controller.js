'use strict';

angular.module('companyCultureApp')
  .controller('LeaderboardController', function($scope, $rootScope, $http, async){
    console.log('leaderboard controller')
    var self = this;

    $scope.memberData = [];


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
    })

    // current Group Data
    $rootScope.$on('groupData ready', function(event, data){
      $scope.memberData = [];
      $scope.groupData = data;
      console.log('$scope.groupData in leaderboard: ', $scope.groupData);
      $rootScope.$on('data is ready', function() {
        $http.post('/api/groups/setLeaderboardData', $scope.groupData).success(function(data){
          console.log('done setting leaderboard data: ', data);
          $scope.memberData = data;
          if($scope.currentQuestionData.answersArray) {
            for (var i=0; i<$scope.memberData.length; i++) {
              for (var j=0; j<$scope.currentQuestionData.answersArray.length; j++) {
                if($scope.memberData[i].item._id === $scope.currentQuestionData.answersArray[j].user._id) {
                  $scope.memberData[i].currentScore = $scope.currentQuestionData.answersArray[j].gameTime;
                }
              }
            }
          }
        })
      })
    })
  })