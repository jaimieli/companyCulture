'use strict';

angular.module('companyCultureApp')
  .controller('GroupCtrl', function ($scope, $stateParams) {
    $scope.message = 'Hello';
    $scope.groupId = $stateParams.id;
    console.log($scope.groupId);
  });
