'use strict';

angular.module('companyCultureApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $location, $rootScope) {
    var self = this;
    $scope.currentUser = Auth.getCurrentUser();
    console.log('current user obj: ', $scope.currentUser);

    this.endGame = function() {
      console.log('trying to end game');
      $http.put('/api/questions/' + $scope.currentQuestionData._id, {
        active: false,
        activeGame: false
      }).success(function(data){
        console.log('question obj after game is timeout: ', data);
        $rootScope.$emit('update group data');
      })
    }

    // automatically end game when everyone in the answers array has completed the game
    $rootScope.$on('everyone has completed the game', function(event){
      console.log('catching everyone has completed game')
      self.endGame();
    })

    this.sendGame = function() {
      console.log('trying to send game')
      // set activeGame --> true on question object
      $http.put('/api/questions/' + $scope.currentQuestionData._id, {activeGame: true}).success(function(data){
        console.log('question obj after game is set to active: ', data);
        $rootScope.$emit('update group data');
        })
      // send email out to users who've answered the question to notify them that there's a new game
      var len = $scope.currentQuestionData.answersArray.length;
      for (var i = 0; i < len; i++) {
        var subject = $scope.currentUser.name + ' Has Posted A New Game To ' + $scope.groupData.groupName + '!';
        var link = 'http://teamflock.herokuapp.com/login?cookie=' + $scope.groupId;
        var body =
        '<div style="text-align: center;">' +
          '<div>' +
            '<h1 style="background-color: #3881C2; color: #fff; text-align: center; padding-top: 10px; padding-bottom: 10px; font-family: Lato; font-weight: 300; font-size: 40px; width: 450px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 0px;">Flock</h1>' +
          '</div>' +
          '<div style="border: 1px solid #eee; top: -20px; width: 450px; display: block; margin-left: auto; margin-right: auto; font-family: Lato; font-weight: 300;">' +
            '<p style="padding-top: 10px; padding-right: 25px; padding-left: 25px; line-height: 22px; text-align: justify;"><span style="font-weight: 500;">' +
            $scope.currentUser.name +
            '</span> has posted a new game to <span style="font-weight: 500;">' +
            $scope.groupData.groupName +
            '</span>! Check it out to see how well you know your team members!</p>' +
            '<a href="' +
            link +
            '" style="text-decoration: none; display: block; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 35px; background-color: #3881C2; width: 110px; padding-top: 10px; padding-bottom: 10px; color: #fff; font-family: Lato; font-size: 18px; font-weight: 300;">Play</a>' +
          '</div>' +
        '</div>';
        var message = {
          userId: "me",
          message: {
            to: $scope.currentQuestionData.answersArray[i].user.email,
            subjectLine: subject,
            bodyOfEmail: body
          }
        }
        $http.post('/api/messages/sendMessage', message).success(function(data) {
          console.log('Email Results after sending game: ', data.gmail);
        })
      }
    }
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
    console.log("$scope.currentUser: ", $scope.currentUser);
    var self = this;
    this.sendMessage = function(invite) {
      $http.post('/api/users/validateEmails', invite).success(function(data){
        if (data.valid) {
          invite.validity = true;
          console.log('self.inviteArrField after validity: ', self.inviteArrField)
          invite.sent = true;
          invite.button = "Invite Sent";
          console.log('$scope.currentUser: ', $scope.currentUser);
          var subject = $scope.currentUser.name + ' Has Invited You To Join Flock!';
          var link = 'http://teamflock.herokuapp.com/login?cookie=' + $scope.groupId;
          var body =
          '<div style="text-align: center;">' +
            '<div>' +
              '<h1 style="background-color: #3881C2; color: #fff; text-align: center; padding-top: 10px; padding-bottom: 10px; font-family: Lato; font-weight: 300; font-size: 40px; width: 450px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 0px;">Flock</h1>' +
            '</div>' +
            '<div style="border: 1px solid #eee; top: -20px; width: 450px; display: block; margin-left: auto; margin-right: auto; font-family: Lato; font-weight: 300;">' +
              '<p style="padding-top: 10px; padding-right: 25px; padding-left: 25px; line-height: 22px; text-align: justify;">Flock is a fun way to build company culture. <span style="font-weight: 500">' + $scope.currentUser.name +
              '</span> is signed up and a member of <span style="font-weight: 500">' +
              $scope.groupData.groupName +
              '</span> and would love for you to join too!</p>' +
              '<a href="' +
              link +
              '" style="text-decoration: none; display: block; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 35px; background-color: #3881C2; width: 110px; padding-top: 10px; padding-bottom: 10px; color: #fff; font-family: Lato; font-size: 18px; font-weight: 300;">Join</a>' +
            '</div>' +
          '</div>';
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
            // 5 second delay before update
            console.log('Email Results: ', data);
            $rootScope.$emit('update group data');
          })
        } else {
          invite.validity = false;
          console.log('self.inviteArrField after validity: ', self.inviteArrField);
          return;
        }
      })
    }
    // removing member from group
    this.removeMember = function(user) {
      console.log('delete user: ', user.user, 'from groupID: ', $scope.groupData._id);
      $http.post('/api/groups/removeMember/'+$scope.groupData._id, user.user).success(function(data){
        console.log('group after deleting user: ', data.group);
        console.log('user after deleting user from group: ', data.user);
        $rootScope.$emit('update group data');
      })
    }

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
        // send email out to all group users to notify them that their group has been deactivated
        // var len = $scope.groupData.users.length;
        // for (var i = 0; i < len; i++) {
        //   var subject = $scope.groupData.groupName + ' group has been deactivated';
        //   var body = '<p><a href="http://teamflock.herokuapp.com/login">Login</a> to make your own group and invite your friends!</p>'
        //   var message = {
        //     userId: "me",
        //     message: {
        //       to: $scope.groupData.users[i].user.email,
        //       subjectLine: subject,
        //       bodyOfEmail: body
        //     }
        //   }
        //   $http.post('/api/messages/sendMessage', message).success(function(data) {
        //     console.log('Email Results after deactivating group: ', data.gmail);
        //   })
        // }
      });
    }

  })

// MATCHING CTRL FOR MATCHING QUESTION
  var MatchingCtrl = /*@ngInject*/ function ($scope, $modal, $log) {
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
  var MatchingInstanceCtrl = /*@ngInject*/ function ($rootScope, $scope, $modalInstance, $http, $stateParams, newQuestionMessage) {

    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createMatching = function(){
      var questionObj = {
        active: true,
        groupId: $stateParams.id,
        questionType: 'Match',
        questionText: $scope.questionText,
        activeGame: false
      }
      console.log('questionObj: ', questionObj);
      $http.post('/api/questions/' + $stateParams.id, questionObj).success(function(data){
        console.log('group object after adding question: ', data);
        $rootScope.$emit('update group data');
        $rootScope.$on('groupData ready', function(event, data){
          newQuestionMessage.sendNewQuestionMessage(data);
        })
      });
    };
  };

// SORTING CTRL FOR SORTING QUESTION
  var SortingCtrl = /*@ngInject*/ function ($scope, $modal, $log) {
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
  var SortingInstanceCtrl = /*@ngInject*/ function ($scope, $modalInstance, $http, $rootScope) {
    var sortType = $scope.sortType;
    $scope.options = [
      { qtype: "Would you rather...", type: "would", value: true },
      { qtype: "Have you ever...", type: "have", value: true },
      { qtype: "Choose between...", type: "choose", value: true },
    ];
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.test = function (argument) {
      console.log($scope.Test);
    }
  };

 //SORTING FORM CONTROLLER
var FormController = /*@ngInject*/ function($scope, $http, $stateParams, $rootScope, newQuestionMessage) {
 $scope.createSorting = function(sortType) {
    // console.log("is this sorting working?");
    console.log('$scope.optionA: ', $scope.optionA);
    console.log('$scope.optionB: ', $scope.optionB);
    var groupId = $stateParams.id;
    console.log(sortType.type);
    if (sortType.type === "would") {
      console.log("in would");
      $http.post('/api/questions/' + groupId, {
        active: true,
        groupId: groupId,
        questionType: 'Sort',
        sortType: sortType.type,
        questionText: "Would you rather " + $scope.optionA + " or " + $scope.optionB + "?",
        questionOption: {
          optionA: $scope.optionA,
          optionB: $scope.optionB
          },
        activeGame: false
        }).success(function(data){
        console.log('group object after adding question: ', data);
        $rootScope.$emit('update group data');
        $rootScope.$on('groupData ready', function(event, data){
          newQuestionMessage.sendNewQuestionMessage(data);
        })
      });
    }
    if (sortType.type === "have") {
      $http.post('/api/questions/' + groupId, {
        active: true,
        groupId: groupId,
        questionType: 'Sort',
        sortType: sortType.type,
        questionText: "Have you ever " + $scope.questionText + "?",
        questionOption: {
          optionA: 'Yes',
          optionB: 'No'
          },
        activeGame: false
      }).success(function(data){
        console.log('group object after adding question: ', data);
        $rootScope.$emit('update group data');
        $rootScope.$on('groupData ready', function(event, data){
          newQuestionMessage.sendNewQuestionMessage(data);
        })
      });;
    }
    if (sortType.type === "choose") {
      $http.post('/api/questions/' + groupId, { active: true, groupId: groupId, questionType: 'Sort', sortType: sortType.type, questionText: $scope.optionA + " or " + $scope.optionB + "?", questionOption: {optionA: $scope.optionA, optionB: $scope.optionB}, activeGame: false}).success(function(data){
        console.log('group object after adding question: ', data);
        $rootScope.$emit('update group data');
        $rootScope.$on('groupData ready', function(event, data){
          newQuestionMessage.sendNewQuestionMessage(data);
        })
      });;
    }

  };
};

// SORTING CTRL FOR SORTING QUESTION
  var OrderingCtrl = /*@ngInject*/ function ($scope, $modal, $log) {
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
  var OrderingInstanceCtrl = /*@ngInject*/ function ($scope, $modalInstance, $http, $rootScope, $stateParams, newQuestionMessage) {
    var groupId = $stateParams.id;
    $scope.ok = function () {
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.createOrdering = function(){
      var questionObj = {
        active: true,
        groupId: groupId,
        questionType: 'Order',
        questionText: $scope.questionText,
        activeGame: false
      }
      $http.post('/api/questions/' + groupId, questionObj).success(function(data){
        console.log('group object after adding question: ', data);
        $rootScope.$emit('update group data');
        $rootScope.$on('groupData ready', function(event, data){
          newQuestionMessage.sendNewQuestionMessage(data);
        })
      });
    };

  };

