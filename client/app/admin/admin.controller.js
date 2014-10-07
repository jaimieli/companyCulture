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
    $scope.createMatching = function() {
      console.log("is this matching working?");
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
    $scope.createSorting = function() {
      console.log("is this sorting working?");
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
    $scope.createOrdering = function() {
      console.log("is this ordering working?");
    };
  };






