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
      $scope.groupData = data;
      console.log('$scope.groupData in leaderboard: ', $scope.groupData);


      var setMemberData = function(member, done) {
        var randomBird = Math.ceil(Math.random() * 10);
        var memberObj = {};
        memberObj.item = member.user;
        memberObj.bestScore = member.bestTime;
        memberObj.item.google.picture = function() {
          if (member.user.google.picture === "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg") {
            return "/assets/images/birdpictures/bird" + randomBird + ".png";
          } else {
            return member.user.google.picture;
          }
        }();
        $scope.memberData.push(memberObj);
        done();
      }


      var complete = function () {
        console.log("$scope.memberData in complete:", $scope.memberData);
        console.log("$scope.currentQuestionData in complete:", $scope.currentQuestionData);
        console.log("finished!");
        $rootScope.$on("data is ready", function (event, data) {
          console.log("got into rootScope!!!", data);
          $scope.currentQuestionData = data;
          for (var i=0; i<$scope.memberData.length; i++) {
            for (var j=0; j<$scope.currentQuestionData.answersArray.length; j++) {
              if($scope.memberData[i].item._id === $scope.currentQuestionData.answersArray[j].user._id) {
                $scope.memberData[i].currentScore = $scope.currentQuestionData.answersArray[j].gameTime;
              }
            }
          }
          console.log("$scope.memberData at end:", $scope.memberData);
        })
      }
      async.each($scope.groupData.users, setMemberData, complete);
      console.log("memberData:", $scope.memberData);
    })
  })