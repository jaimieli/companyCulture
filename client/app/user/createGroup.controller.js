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
        for (var i = 0; i < len; i++) {
          var subject = data.invited[i].name + ', Join Company Culture Group: ' + data.groupName;
          var link = 'http://localhost:9000/login?g=' + data._id;
          var body = '<p>Join this group by clicking <a href="' + link + '">here.</a></p>';
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