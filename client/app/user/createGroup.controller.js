'use strict';

angular.module('companyCultureApp')
  .controller('CreateGroupCtrl', function ($scope, $http, Auth, User) {
    this.newGroup = {invited: []};
    this.invited = [];
    this.countMembers = 0;
    this.addMember = function() {
      this.newGroup.invited.push({
        name: '',
        email: ''
      })
      this.countMembers++;
    };
    this.createGroup = function(group){
      console.log('group obj: ', group);
      console.log('# of invited members: ', this.countMembers)
      // set other properties on the new group
      if (this.countMembers < 2) {
        return alert('You need to invite at least 2 members.')
      }
      this.newGroup.admin = $scope.currentUser._id;
      this.newGroup.users = [$scope.currentUser._id];
      this.newGroup.active = true;
      console.log('group obj after adding props: ', group);
      $http.post('/api/groups', group).success(function(data){
        console.log(data);
        $scope.groupCreated = data;
        // emit the event below so that the parent user controller will listen for the event
        $scope.$emit('new group created');
        // creating the message for each initially invited member
        var len = data.invited.length;
        for (var i = 0; i < len; i++) {
          var subject = data.invited[i].name + ', Join Company Culture Group: ' + data.groupName;
          var link = 'http://localhost:9000/login?cookie=' + data._id;
          var body = '<p>Join this group by clicking <a href="' + link + '">here.</a></p>';
          var message = {
            userId: "me",
            message: {
              to: data.invited[i].email,
              subjectLine: subject,
              bodyOfEmail: body
            },
            groupId: data._id,
          }
          $http.post('/api/messages/sendMessage', message).success(function(data) {
            console.log('Email Results: ', data.gmail);
          })
        }
      });
    };
  });