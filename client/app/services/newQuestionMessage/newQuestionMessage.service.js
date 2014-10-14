'use strict';

angular.module('companyCultureApp')
  .factory('newQuestionMessage', function ($http) {
    return {
      sendNewQuestionMessage: function (groupData) {
        console.log('groupData in newQuestionMessage factory: ', groupData);
        var len = groupData.users.length;
        for (var i = 0; i < len; i++) {
          var subject = 'New Question Has Been Posted to Group ' + groupData.groupName;
          var body = '<p>'
                    + groupData.questionsArr[groupData.questionsArr.length-1].questionText
                    + '</p>'
                    +'<p><a href="http://localhost:9000/login">Login</a> to play!</p>'
          var message = {
            userId: "me",
            message: {
              to: groupData.users[i].email,
              subjectLine: subject,
              bodyOfEmail: body
            }
          }
          return $http.post('/api/messages/sendMessage', message)
        }
      }
    };
  });
