'use strict';

angular.module('companyCultureApp')
  .controller('CreateGroupCtrl', function ($scope, $http, Auth, User, $modal, $rootScope, $log, $location){
    $scope.currentUser = Auth.getCurrentUser();
    console.log('$scope.currentUser in create a group: ', $scope.currentUser);

    this.newGroup = {
      active: true,
      invited: [{name: "", email: ""},{name: "", email: ""}]
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

    }; //closes addMember
    this.deleteMember = function(index) {
      this.newGroup.invited.splice(index, 1);
    }
    var self = this;


    var createGroupAndEmail = function(group) {
      console.log('group object in createGroupEmail beginning: ', group);
      $http.post('/api/groups', group).success(function(data){
        console.log('groupCreated data: ', data);
        $scope.groupCreated = data;

        // emit the event below so that the parent user controller will listen for the event
        $scope.$emit('new group created');
        $rootScope.$emit('new group created', data)

        // reset input variables
        self.newGroup = {
          active: true,
          invited: []
        };

        var len = group.invited.length;
        for (var i = 0; i < len; i ++) {
          console.log('in message for loop');
          var subject = $scope.currentUser.name + ' Has Invited You To Join Flock!';
          var link = 'http://teamflock.herokuapp.com/login?cookie=' + data._id;
          var body =
          '<div style="text-align: center;">' +
            '<div>' +
              '<h1 style="background-color: #3881C2; color: #fff; text-align: center; padding-top: 10px; padding-bottom: 10px; font-family: Lato; font-weight: 300; font-size: 40px; width: 450px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 0px;">Flock</h1>' +
            '</div>' +
            '<div style="border: 1px solid #eee; top: -20px; width: 450px; display: block; margin-left: auto; margin-right: auto; font-family: Lato; font-weight: 300;">' +
              '<p style="padding-top: 10px; padding-right: 25px; padding-left: 25px; line-height: 22px; text-align: justify;">Flock is a fun way to build company culture. <span style="font-weight: 500;">' +
              $scope.currentUser.name +
              '</span> just signed up as a member of <span style="font-weight: 500;">' +
              $scope.groupCreated.groupName +
              '</span> and would love for you to join too!</p>' +
              '<a href="' +
              link +
              '" style="text-decoration: none; display: block; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 35px; background-color: #3881C2; width: 110px; padding-top: 10px; padding-bottom: 10px; color: #fff; font-family: Lato; font-size: 18px; font-weight: 300;">Join</a>' +
            '</div>' +
          '</div>';
          var message = {
            userId: "me",
            message: {
              to: group.invited[i].email,
              subjectLine: subject,
              bodyOfEmail: body
            },
            groupId: data._id,
          };
          $http.post('api/messages/sendMessage', message).success(function(data){
            console.log('Email results after creating group and sending one email: ', data)
          })
        } // closes for
      }); // closes post
    } // closes createGroupAndSendEmail

    this.createGroup = function(group){
      console.log('group obj: ', group);
      console.log('# of invited members: ', this.countMembers)
      group.admin = $scope.currentUser._id;
      group.users = [{
        user: $scope.currentUser._id
        }];
      // if (this.countMembers < 2 || group.groupName === undefined) {
      //   return alert('You need to submit a groupName and invite at least 2 members.')
      // }
      console.log('group before post: ', group);
      $scope.emailResults = [];
      $http.post('/api/groups/validateEmails', group).success(function(data) {
        console.log('done validating emails: ', data);
        self.newGroup = data;
        console.log('self.newGroup after validating emails: ', self.newGroup);
        var numOfValid = 0;
        for (var i = 0; i < data.invited.length; i++) {
          if(data.invited[i].validity === false) {
            return;
          } else {
            numOfValid++;
          }
        }
        if(numOfValid === data.invited.length) {
          console.log('numOfValid equals data.invited.length')
          createGroupAndEmail(data);
          $scope.open();
        }
      })
    }; //closes this.createGoup


    $scope.open = function () {
      var modalInstance = $modal.open({
          templateUrl: 'afterGroupCreation.html',
          controller: 'CreatedGroupModalInstanceCtrl',
          // backdrop: 'static',
          resolve: {
            groupCreated: function() {
              return $scope.groupCreated;
              console.log("groupCreated:", groupCreated);
            }
          }
        });
      //modalInstance result takes 2 arguments, 1st is when clicked ok, 2nd is when dismissed or cancelled
      modalInstance.result.then(function() {}, function () {
        $location.path('/user');
        $log.info('Modal dismissed at: ' + new Date());
        });
     } //closes Modal
  }) //closes CreateGroupCtrl

.controller('CreatedGroupModalInstanceCtrl', function($scope, $modalInstance, $http, Auth, $rootScope, groupCreated) {
      $rootScope.$on('new group created', function(event, data){
        console.log('new group created in modal');
        console.log('data: ', data);
        $scope.newGroupCreated = data;
        console.log('$scope.newGroupCreated inside on event: ', $scope.newGroupCreated)
      })
      $scope.ok = function () {};
    });

