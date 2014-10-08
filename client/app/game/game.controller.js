'use strict';

angular.module('companyCultureApp')
  .controller('GameCtrl', function ($scope, $http) {
     $http.get('/api/questions').success(function(questionsArray) {
         $scope.questionsArray = questionsArray;
     });
     $http.get('/api/groups').success(function(groupData) {
         $scope.groupData = groupData;
         // console.log("Group Data:", groupData);
         // console.log("QuestionsArr 0: ", groupData[groupData.length-1].questionsArr[0]);
         // console.log("QuestionsArr: ", questionsArr);
     });
     $scope.random = function() {
      return 0.5 - Math.random();
     };
     $scope.list1 = {title: 'AngularJS - Drag Me'};
     $scope.list2 = {};
  }).controller('oneCtrl', function($scope, $timeout) {
  $scope.images = [{'thumb': '1.png'},{'thumb': '2.png'},{'thumb': '3.png'},{'thumb': '4.png'}]
  $scope.list1 = [];
  angular.forEach($scope.images, function(val, key) {
    $scope.list1.push({});
  });
  $scope.list2 = [
    { 'title': 'KnockoutJS', 'drag': true },
    { 'title': 'EmberJS', 'drag': true },
    { 'title': 'BackboneJS', 'drag': true },
    { 'title': 'AngularJS', 'drag': true }
  ];

   $scope.startCallback = function(event, ui, title) {
    console.log('You started draggin: ' + title.title);
    $scope.draggedTitle = title.title;
  };

  $scope.stopCallback = function(event, ui) {
    console.log('Why did you stop draggin me?');
  };

  $scope.dragCallback = function(event, ui) {
    console.log('hey, look I`m flying');
  };

  $scope.dropCallback = function(event, ui) {
    console.log('hey, you dumped me :-(' , $scope.draggedTitle);
  };

  $scope.overCallback = function(event, ui) {
    console.log('Look, I`m over you');
  };

  $scope.outCallback = function(event, ui) {
    console.log('I`m not, hehe');
  };
});

