angular.module('companyCultureApp')
  .controller('ShowQuestionCtrl', function ($scope, $http, Auth, User, $location, $rootScope) {
    var self = this;
    this.userAnswer = function(answer) {
      if (this.answer === undefined) {
        this.answer = answer;
      }
      console.log('answering question');
      console.log('this.answer: ', this.answer);
      var questionId = $scope.groupData.questionsArr[$scope.groupData.questionsArr.length-1]._id;
      console.log('questionId: ', questionId);
      var answerObj = {
        user: $scope.currentUser._id,
        answer: this.answer,
        completed: false
      };
      console.log('answerObj: ', answerObj);
      $http.post('/api/questions/' + questionId + '/addAnswer', answerObj).success(function(data){
        console.log('data after adding users answer: ', data);
        $rootScope.$emit('update group data');
        // reset the answer field
        self.answer = undefined;
      })
    }
  })