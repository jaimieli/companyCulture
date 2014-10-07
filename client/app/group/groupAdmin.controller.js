'use strict';

angular.module('companyCultureApp')
  .controller('GroupAdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    // $scope.users = User.query();
    $scope.currentUser = Auth.getCurrentUser();
    console.log('current user obj: ', $scope.currentUser);

    // $scope.delete = function(user) {
    //   User.remove({ id: user._id });
    //   angular.forEach($scope.users, function(u, i) {
    //     if (u === user) {
    //       $scope.users.splice(i, 1);
    //     }
    //   });
    // };
    this.invitedArr = [];
    this.invitedMember = function() {
      return {
      name: '',
      email: ''
      }
    };
    this.addMember = function() {
      this.invitedArr.push(new this.invitedMember());
    }
    this.sendMessage = function(invite) {
      var subject = invite.name + ', Join Company Culture Group: ' + $scope.groupCreated.groupName;
      var body = '<p>Login or Signup through Google by clicking <a href="http://localhost:9000/login">here.</a></p>'
      var message = {
        userId: "me",
        message: {
          to: invite.email,
          subjectLine: subject,
          bodyOfEmail: body
        }
      }
      console.log(message);
      $http.post('/api/messages/sendMessage', message).success(function(data) {
        console.log('Email Results: ', data.results);
      })
      // $http.put('/api/groups/' + $scope.groupCreated._id, {})
    }
  });