'use strict';

angular.module('companyCultureApp')
  .factory('newQuestionMessage', function ($http, Auth) {
    return {
      sendNewQuestionMessage: function (groupData) {
        console.log('groupData in newQuestionMessage factory: ', groupData);
        var len = groupData.users.length;
        for (var i = 0; i < len; i++) {
          var subject = groupData.users[0].user.name + ' Has Posted a New Question To ' + groupData.groupName + "!";
          var body =
          '<div style="text-align: center;">' +
            '<div>' +
              '<h1 style="background-color: #3881C2; color: #fff; text-align: center; padding-top: 10px; padding-bottom: 10px; font-family: Lato; font-weight: 300; font-size: 40px; width: 450px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 0px;">Flock</h1>' +
            '</div>' +
            '<div style="border: 1px solid #eee; top: -20px; width: 450px; display: block; margin-left: auto; margin-right: auto; font-family: Lato; font-weight: 300;">' +
              '<p style="padding-top: 10px; padding-right: 25px; padding-left: 25px; line-height: 22px; text-align: justify;"><span style="font-weight: 500;">' +
              Auth.getCurrentUser().name +
              '</span> just posted a new question to <span style="font-weight: 500;">' +
              groupData.groupName +
              '</span>! Answer the question so we can create a great game for you!</p>' +
              '<a href="http://teamflock.herokuapp.com/" style="text-decoration: none; display: block; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 35px; background-color: #3881C2; width: 110px; padding-top: 10px; padding-bottom: 10px; color: #fff; font-family: Lato; font-size: 18px; font-weight: 300;">Answer</a>' +
            '</div>' +
          '</div>';
          var message = {
            userId: "me",
            message: {
              to: groupData.users[i].user.email,
              subjectLine: subject,
              bodyOfEmail: body
            }
          }
          return $http.post('/api/messages/sendMessage', message)
        }
      }
    };
  });
