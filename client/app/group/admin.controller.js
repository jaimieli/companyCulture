'use strict';

angular.module('companyCultureApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $location) {
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
        $scope.$emit('update group data');
      })
    }
    // removing member from group
    this.removeMember = function(user) {
      console.log('delete user: ', user, 'from groupID: ', $scope.groupData._id);
      $http.post('/api/groups/removeMember/'+$scope.groupData._id, user).success(function(data){
        console.log('group after deleting user: ', data.group);
        console.log('user after deleting user from group: ', data.user);
        $scope.$emit('update group data');
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
    //     $scope.$emit('update group data');
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
        $scope.$emit('update group data')
        $location.path('/user');
      });
    }
  });









