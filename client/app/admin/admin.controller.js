'use strict';

angular.module('companyCultureApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {
    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });

// MATCHING CTRL FOR MATCHING QUESTION
  var MatchingCtrl = function ($scope, $modal, $log) {
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
  var MatchingInstanceCtrl = function ($scope, $modalInstance, $http) {
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createMatching = function(){
      $http.post('/api/questions', { questionType: 'Match', questionText: $scope.questionText});
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

