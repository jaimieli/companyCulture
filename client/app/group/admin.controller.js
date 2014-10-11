'use strict';

angular.module('companyCultureApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $location, $rootScope) {
    $scope.currentUser = Auth.getCurrentUser();

    console.log('current user obj: ', $scope.currentUser);

    // adding members to invite
    this.inviteArrField = [];
    this.inviteMemberObj = function() {
      return {
      name: '',
      email: '',
      sent: false,
      button: 'Send Invite'
      }
    };
    this.addMemberField = function() {
      this.inviteArrField.push(new this.inviteMemberObj());
    }

    // sending invitation to member to join group
    this.sendMessage = function(invite) {
      invite.sent = true;
      invite.button = "Invite Sent"
      var subject = invite.name + ', Join Company Culture Group: ' + $scope.groupData.groupName;
      var link = 'http://localhost:9000/login?cookie=' + $scope.groupId;
      var body = '<p>Join this group by clicking <a href="' + link + '">here.</a></p>';
      var message = {
        userId: "me",
        message: {
          to: invite.email + '@gmail.com',
          subjectLine: subject,
          bodyOfEmail: body
        },
        groupId: $scope.groupId,
        invite: invite
      }
      console.log(message);
      $http.post('/api/messages/sendMessage', message).success(function(data) {
        // 5 second delay before update
        $rootScope.$emit('update group data');
      })
    }
    // removing member from group
    this.removeMember = function(user) {
      console.log('delete user: ', user, 'from groupID: ', $scope.groupData._id);
      $http.post('/api/groups/removeMember/'+$scope.groupData._id, user).success(function(data){
        console.log('group after deleting user: ', data.group);
        console.log('user after deleting user from group: ', data.user);
        $rootScope.$emit('update group data');
      })
    }
    // delete/destroy group
    // this.deleteGroupButtonText = 'Delete Group';
    // this.deleteGroup = function() {
    //   this.deleteGroupButtonText = 'Group Deleted';
    //   console.log('trying to delete group');
    //   $http.delete('api/groups/'+$scope.groupData._id).success(function(data){
    //     console.log('deleted group');
    //     // update group data
    //     $rootScope.$emit('update group data');
    //     // redirect to user page that lists all the groups the user belongs to
    //     $location.path('/user');
    //   });
    // };
    // deactivate group 'delete'
    this.deactivateGroupButtonText = 'Deactivate Group';
    this.deactivateGroup = function() {
      console.log('trying to deactivate group');
      this.deactivateGroupButtonText = 'Group Deactivated';
      var obj = {};
      obj.active = false;
      $http.put('api/groups/'+$scope.groupData._id, obj).success(function(data){
        console.log('changed group to inactive: ', data);
        $rootScope.$emit('update group data')
        $location.path('/user');
      });
    }
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
  var MatchingInstanceCtrl = function ($rootScope, $scope, $modalInstance, $http, $stateParams) {
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createMatching = function(){
      var questionObj = {
        groupId: $stateParams.id,
        questionType: 'Match',
        questionText: $scope.questionText
      }
      console.log('questionObj: ', questionObj);
      $http.post('/api/questions/' + $stateParams.id, questionObj).success(function(data){
        console.log('group object after adding question: ', data);
        $rootScope.$emit('update group data');
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
  var SortingInstanceCtrl = function ($scope, $modalInstance, $http, $rootScope) {
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
    $http.post('/api/questions/' + $stateParams.id, questionObj).success(function(data){
      console.log('group object after adding question: ', data);
      $rootScope.$emit('update group data');
    });
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
  var OrderingInstanceCtrl = function ($scope, $modalInstance, $http, $rootScope) {
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createOrdering = function(){
      $http.post('/api/questions', { questionType: 'Order', questionText: $scope.questionText});
    };
    $http.post('/api/questions/' + $stateParams.id, questionObj).success(function(data){
      console.log('group object after adding question: ', data);
      $rootScope.$emit('update group data');
    });
  };

