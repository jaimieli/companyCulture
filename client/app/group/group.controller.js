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

    // updates scope.groupdata when a user has been removed from a group
    $rootScope.$on('update group data', function(event){
      $http.get('/api/groups/'+$scope.groupId).success(function(data){
        console.log('trying to update group data');
        $scope.groupData = data;
        console.log('$scope.groupData after some change to the group: ', $scope.groupData);
        $rootScope.$emit('question answered or created');
        $rootScope.$emit('groupData is ready', data);
      })
    })
  });
  // MATCHING CTRL FOR MATCHING QUESTION
  var MatchingCtrl = function ($scope, $modal, $log, $stateParams) {
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'matchingQuestion.html',
        controller: MatchingInstanceCtrl,
        size: size
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  };
  var MatchingInstanceCtrl = function ($scope, $modalInstance, $http, $stateParams) {
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createMatching = function(){
      $http.post('/api/questions', { questionType: 'Match', questionText: $scope.questionText}).success(function(data){
        $http.get('/api/groups/'+$stateParams.id).success(function(data){
          console.log('trying to update group data');
          $scope.groupData = data;
          console.log('$scope.groupData after some change to the group: ', $scope.groupData);
        })
      });
    };
  };

// SORTING CTRL FOR SORTING QUESTION
  var SortingCtrl = function ($scope, $modal, $log) {
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'sortingQuestion.html',
        controller: SortingInstanceCtrl,
        size: size
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  };
  var SortingInstanceCtrl = function ($scope, $modalInstance, $http) {
    var sortType = $scope.sortType;
    $scope.options = [
      { type: "would", value: true },
      { type: "have", value: true },
      { type: "choose", value: true },
    ];
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.test = function (argument) {
      console.log($scope.Test);
    }
  };
 //SORTING FORM CONTROLLER
var FormController = function($scope, $http) {
 $scope.createSorting = function(sortType) {
    // console.log("is this sorting working?");
    if (sortType.type === "would") {
      $http.post('/api/questions', { questionType: 'Sort', sortType: sortType.type, questionText: "Would you rather " + $scope.optionA + " or " + $scope.optionB + "?", questionOption: {optionA: $scope.optionA, optionB: $scope.optionB}});
    }
    if (sortType.type === "have") {
      $http.post('/api/questions', { questionType: 'Sort', sortType: sortType.type, questionText: "Have you ever " + $scope.questionText + "?" });
    }
    if (sortType.type === "choose") {
      $http.post('/api/questions', { questionType: 'Sort', sortType: sortType.type, questionText: $scope.optionA + " or " + $scope.optionB + "?", questionOption: {optionA: $scope.optionA, optionB: $scope.optionB}});
    }
  };
};

// SORTING CTRL FOR SORTING QUESTION
  var OrderingCtrl = function ($scope, $modal, $log) {
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'orderingQuestion.html',
        controller: OrderingInstanceCtrl,
        size: size
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  };
  var OrderingInstanceCtrl = function ($scope, $modalInstance, $http) {
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createOrdering = function(){
      $http.post('/api/questions', { questionType: 'Order', questionText: $scope.questionText});
    };
  };


