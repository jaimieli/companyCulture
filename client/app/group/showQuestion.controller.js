angular.module('companyCultureApp')
  .controller('ShowQuestionCtrl', function ($scope, $http, Auth, User, $location, $rootScope) {
    this.userAnswer = function(answer) {
      console.log('answering question');
      console.log('this.answer: ', this.answer);
      var questionId = $scope.groupData.questionsArr[$scope.groupData.questionsArr.length-1]._id;
      console.log('questionId: ', questionId);
      var answerObj = {
        user: $scope.currentUser._id,
        answer: this.answer
      };
      console.log('answerObj: ', answerObj);
      $http.post('/api/questions/' + questionId + '/addAnswer', answerObj).success(function(data){
        console.log('data after adding user answer: ', data);
        $rootScope.$emit('update group data');
      })
    }
    // console.log('$scope.Answer: ', $scope.Answer);
    // this.userAnswer = function(answer) {
    //   console.log('answer passed in: ', answer)
    //   var questionId = $scope.groupData.questionsArr[$scope.groupData.questionsArr.length-1]._id;
    //   console.log('questionId: ', questionId);
    //   console.log('userAnswer: ', $scope.answer);
    //   var answerObj = {
    //     user: $scope.currentUser._id,
    //     answer: $scope.answer
    //   };
    //   console.log('answerObj: ', answerObj);
    //   // $http.post('/api/questions')
    //   // $http.post('/api/groups' + $scope.groupId + '/answer, { "AnswerSchema.answer": $scope.userAnswer });
    // };

  })