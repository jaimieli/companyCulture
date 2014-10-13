'use strict';

angular.module('companyCultureApp')
  .controller('GroupCtrl', function ($scope, $stateParams, $http, Auth, $rootScope) {
    var self = this;
    $scope.currentUser = Auth.getCurrentUser();
    console.log('$scope.currentUser on groupPage load: ', $scope.currentUser);
    $scope.groupId = $stateParams.id;
    console.log('$scope.groupId on groupPage load: ', $scope.groupId);
    // function to determine if the user has an outstanding question (or game <-- later)
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
    var checkUserCompletedGame = function(){
      console.log('checking if user completed game');
      $scope.showGame = true;
      var len = $scope.currentQuestionData.answersArray.length;
      for (var i = 0; i < len; i++) {
        if ($scope.currentQuestionData.answersArray[i].user._id === $scope.currentUser._id) {
          if($scope.currentQuestionData.answersArray[i].completed === true) {
            console.log('already completed most recent game');
            $scope.showGame = false;
            return;
          }
        }
      }
    }
    $http.get('/api/groups/'+$scope.groupId).success(function(data){
      $scope.groupData = data;
      console.log('$scope.groupData on groupPage load: ', $scope.groupData);
      // if there's a question
      if(data.questionsArr.length > 0) {
        $scope.currentQuestionId = data.questionsArr[data.questionsArr.length - 1]._id;
        $http.get('/api/questions/' + $scope.currentQuestionId).success(function(data){
          $scope.currentQuestionData = data;
          checkUserAnsweredQuestion();
          checkUserCompletedGame();
          $rootScope.$emit('data is ready', data);
        })
      } else {
        console.log('there are no questions');
      }
      // determine if the user is the admin of the group
      if(data.admin === Auth.getCurrentUser()._id) {
        self.isGroupAdmin = true;
        console.log('admin of the group');
      }
    })

    // after a question is answered or created, run the function to update view
    $rootScope.$on('question answered or created', function(event){
      checkUserAnsweredQuestion();
    })

    // udpates scope.groupdata when a user has been removed from a group
    // $scope.$on('update group data', function(event){
    //   $http.get('/api/groups/'+$scope.groupId).success(function(data){
    //     $scope.groupData = data;
    //     console.log('$scope.groupData after some change to the group: ', $scope.groupData);
    //   })
    // })

    // updates scope.groupdata + scope.currentQuestionData
    $rootScope.$on('update group data', function(event){
      $http.get('/api/groups/'+$scope.groupId).success(function(data){
        $scope.groupData = data;
        console.log('$scope.groupData after some change to the group: ', $scope.groupData);
        $http.get('/api/questions/' + $scope.currentQuestionId).success(function(data){
          $scope.currentQuestionData = data;
          $rootScope.$emit('question answered or created');
          checkUserCompletedGame();
          $rootScope.$emit('data is ready', data);
        })
      })
    })

  });
