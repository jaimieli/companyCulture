'use strict';

angular.module('companyCultureApp')
  .controller('createGroupCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    // $scope.users = User.query();
    // $scope.currentUser = Auth.getCurrentUser();
    // console.log('current user obj: ', $scope.currentUser);

    // $scope.delete = function(user) {
    //   User.remove({ id: user._id });
    //   angular.forEach($scope.users, function(u, i) {
    //     if (u === user) {
    //       $scope.users.splice(i, 1);
    //     }
    //   });
    // };
    this.createGroup = function(groupName){
      console.log(groupName);
      var groupObj = {
        groupName: groupName,
        admin: $scope.currentUser._id,
        users: [$scope.currentUser._id],
        active: true
      };
      console.log(groupObj);
      $http.post('/api/groups', groupObj).success(function(data){
        console.log(data);
        $scope.groupCreated = data;
        // $scope.currentUser.groups.push(data._id);
        // $http.put('/api/users/+'$scope.currentUser._id, $scope.currentUser )
        // $scope.inviteLink = 'http://localhost:9000/auth/google/' + data._id;
      });
      // generate unique links with the group id as a token to be sent out to the people's gmail address
    };
  });