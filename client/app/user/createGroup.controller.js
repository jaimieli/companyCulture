'use strict';

angular.module('companyCultureApp')
  .controller('CreateGroupCtrl', function ($scope, $http, Auth, User, userGroup, async, $rootScope) {
    $scope.currentUser = Auth.getCurrentUser();
    console.log('$scope.currentUser in create a group: ', $scope.currentUser);

    this.newGroup = {
      active: true,
      invited: []
    };
    this.countMembers = 0;
    this.addMember = function($event) {
      $event.preventDefault();
      this.newGroup.invited.push({
        name: "",
        email: ""
      })

      console.log(this.newGroup.invited);
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
      // if (this.countMembers < 2 || group.groupName === undefined) {
      //   return alert('You need to submit a groupName and invite at least 2 members.')
      // }
      console.log('group before post: ', group);
      $scope.emailResults = [];

      var validateAll = function(done) {
        var validateEmail = function(indiv, callback) {
          $http.post('/api/users/validateEmails', indiv).success(function(data){
            // $scope.setValidity(data.valid, index)
            $scope.emailResults.push(data);
            if (data.valid) {
              // self.newGroup.invited[0].validity = true
              indiv.validity = true;
              console.log('self.newGroup after validity: ', self.newGroup)
              callback()
            } else {
              indiv.validity = false;
              console.log('self.newGroup after validity: ', self.newGroup)
              callback();
            }
          })
        }

        var doneValidating = function(err) {
          if(err) console.log(err);
          for (var i = 0; i < self.newGroup.invited.length; i++) {
            if(self.newGroup.invited[i].validity === false) {
              return;
            }
          }
          done(null, 'done validating')


        }

        async.each(group.invited, validateEmail, doneValidating);

      }

      var createGroupAndEmail = function(done) {
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

          // var len = data.invited.length;
          // console.log('$scope.groupCreated: ', $scope.groupCreated);
          // console.log('$scope.currentUser: ', $scope.currentUser);
          // for (var i = 0; i < len; i++) {
          var sendEmail = function(person, callback) {
            var subject = $scope.currentUser.name + ' Has Invited You To Join Flock!';
            var link = 'http://localhost:9000/login?cookie=' + data._id;
            var body =
            '<div style="text-align: center;">' +
              '<div>' +
                '<h1 style="background-color: #70CC7E; color: #fff; text-align: center; padding-top: 10px; padding-bottom: 10px; font-family: Lato; font-weight: 300; font-size: 40px; width: 450px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 0px;">Flock</h1>' +
              '</div>' +
              '<div style="border: 1px solid #eee; top: -20px; width: 450px; display: block; margin-left: auto; margin-right: auto; font-family: Lato; font-weight: 300;">' +
                '<p style="padding-top: 10px; padding-right: 25px; padding-left: 25px; line-height: 22px; text-align: justify;">Flock is a fun way to build company culture. <span style="font-weight: 500;">' +
                $scope.currentUser.name +
                '</span> just signed up as a member of <span style="font-weight: 500;">' +
                $scope.groupCreated.groupName +
                '</span> and would love for you to join too!</p>' +
                '<a href="' +
                link +
                '" style="text-decoration: none; display: block; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 35px; background-color: #70CC7E; width: 110px; padding-top: 10px; padding-bottom: 10px; color: #fff; font-family: Lato; font-size: 18px; font-weight: 300;">Join</a>' +
              '</div>' +
            '</div>';
            var message = {
              userId: "me",
              message: {
                to: person.email,
                subjectLine: subject,
                bodyOfEmail: body
              },
              groupId: data._id,
            }
            $http.post('/api/messages/sendMessage', message).success(function(data) {
              console.log('Email result after creating group and sending one email: ', data.gmail);
              callback();
            })
          }
          // }
          var doneEmailing = function(err) {
            if (err) console.log(err)
            done(null, 'done creating group and sending message');
          }
          async.each(data.invited, sendEmail, doneEmailing);
        });
      }

      var doneTasks = function(err, results) {
        console.log('end of async -- results: ', results);
      }

      async.series([validateAll, createGroupAndEmail], doneTasks);

    };
  });