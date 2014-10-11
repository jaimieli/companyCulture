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
      console.log('currentQuestionAnswersArr: ', currentQuestionAnswersArr)
      var currentQuestionAnswersArrLen = currentQuestionAnswersArr.length;
      for (var i = 0; i < currentQuestionAnswersArrLen; i++) {
        if(currentQuestionAnswersArr[i].user === $scope.currentUser._id) {
          console.log('already completed the most current question')
          $scope.showQuestion = false;
        }
      }
    }
    $http.get('/api/groups/'+$scope.groupId).success(function(data){
      $scope.groupData = data;
      console.log('$scope.groupData on groupPage load: ', $scope.groupData);
      // determine if the user is the admin of the group
      if(data.admin === Auth.getCurrentUser()._id) {
        self.isGroupAdmin = true;
        console.log('admin of the group');
      }
      checkUserAnsweredQuestion();
      $rootScope.$emit('groupData is ready', data);
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

    // udpates scope.groupdata when a user has been removed from a group
    $rootScope.$on('update group data', function(event){
      $http.get('/api/groups/'+$scope.groupId).success(function(data){
        $scope.groupData = data;
        console.log('$scope.groupData after some change to the group: ', $scope.groupData);
        $rootScope.$emit('question answered or created');
        $rootScope.$emit('groupData is ready', data);
      })
    })

  });
