'use strict';

angular.module('companyCultureApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    $scope.currentUser = Auth.getCurrentUser();
    console.log('current user obj: ', $scope.currentUser);

    this.inviteArrField = [];
    this.inviteMemberObj = function() {
      return {
      name: '',
      email: ''
      }
    };
    this.addMember = function() {
      this.inviteArrField.push(new this.inviteMemberObj());
    }
    this.createGroup = function(groupName){
      console.log(groupName);
      var groupObj = {
        groupName: groupName,
        admin: $scope.currentUser._id,
        users: [$scope.currentUser._id],
        active: true
      };
      console.log(groupObj);
      $http.post('/api/groups', groupObj).success(function(data){
        console.log(data);
        $scope.groupCreated = data;
      });
    };
    this.sendMessage = function(invite) {
      var subject = invite.name + ', Join Company Culture Group: ' + $scope.groupData.groupName;
      var link = 'http://localhost:9000/login?cookie=' + $scope.groupId;
      var body = '<p>Login or Signup through Google by clicking <a href="' + link + '">here.</a></p>';
      var message = {
        userId: "me",
        message: {
          to: invite.email,
          subjectLine: subject,
          bodyOfEmail: body
        },
        groupId: $scope.groupId,
        invite: invite
      }
      console.log(message);
      $http.post('/api/messages/sendMessage', message).success(function(data) {
        $scope.groupData = data.group;
        console.log('Email Results: ', data.gmail);
        console.log('$scope.groupData after adding invitee: ', $scope.groupData);
      })
    }
  });