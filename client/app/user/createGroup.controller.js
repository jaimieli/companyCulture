'use strict';

angular.module('companyCultureApp')
  .controller('CreateGroupCtrl', function ($scope, $http, Auth, User, userGroup) {
    this.newGroup = {
      active: true,
      invited: []
    };
    this.countMembers = 0;
    this.addMember = function() {
      this.newGroup.invited.push({
        name: undefined,
        email: undefined
      })
      this.countMembers++;
    };
    this.deleteMember = function(index) {
      this.newGroup.invited.splice(index, 1);
    }
    var self = this;
    this.createGroup = function(group){
      console.log('group obj: ', group);
      console.log('# of invited members: ', this.countMembers)
      group.admin = $scope.currentUser._id;
      group.users = [$scope.currentUser._id];
      if (this.countMembers < 2 || group.groupName === undefined) {
        return alert('You need to submit a groupName and invite at least 2 members.')
      }
      console.log('group before post: ', group);
      $http.post('/api/groups', group).success(function(data){
        console.log(data);
        $scope.groupCreated = data;

        // emit the event below so that the parent user controller will listen for the event
        $scope.$emit('new group created');

        // reset input variables
        self.newGroup = {
          active: true,
          invited: []
        };

        // creating the message for each initially invited member
        var len = data.invited.length;
        console.log('$scope.currentUser: ', $scope.currentUser);
        for (var i = 0; i < len; i++) {
          var subject = data.invited[i].name + ' has invited you to join Flock!';
          var link = 'http://localhost:9000/login?cookie=' + data._id;
          var body =
          '<div style="text-align: center;">' +
            '<div>' +
              '<h1 style="background-color: #70CC7E; color: #fff; text-align: center; padding-top: 10px; padding-bottom: 10px; font-family: Lato; font-weight: 300; font-size: 40px; width: 450px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 0px;">Flock</h1>' +
            '</div>' +
            '<div style="border: 1px solid #eee; top: -20px; width: 450px; display: block; margin-left: auto; margin-right: auto; font-family: Lato; font-weight: 300;">' +
              '<p style="padding-top: 10px; padding-right: 25px; padding-left: 25px; line-height: 22px; text-align: justify;">Flock is a fun way to build company culture. ' + $scope.currentUser.name + ' just signed up and would love for you to join too!</p>' +
              '<a href="' + link + '" style="text-decoration: none; display: block; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 35px; background-color: #70CC7E; width: 110px; padding-top: 10px; padding-bottom: 10px; color: #fff; font-family: Lato; font-size: 18px; font-weight: 300;">Join</a>' +
            '</div>' +
          '</div>';
          var message = {
            userId: "me",
            message: {
              to: data.invited[i].email+'@gmail.com',
              subjectLine: subject,
              bodyOfEmail: body
            },
            groupId: data._id,
          }
          $http.post('/api/messages/sendMessage', message).success(function(data) {
            console.log('Email Results after creating group: ', data.gmail);
          })
        }
      });
    };
  });