'use strict';

angular.module('companyCultureApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $rootScope, navbar, $stateParams, $http) {

    $scope.menu = [{
      'title': 'My Teams',
      'link': '/user'
    },
    {
      'title': 'Create a Team',
      'link': '/create'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    // only show leaderboard and groupadmin navbar when we're in a group
    if($stateParams.id) {
      console.log('in group');
      $scope.inGroup = true;
    } else {
      $scope.inGroup = false;
    }
    console.log('$stateParams.id in navbar: ', $stateParams.id)
    $scope.groupId = $stateParams.id;



    // $scope.groupName = navbar.getGroupName();
    // console.log('$scope.groupName in navbar: ', $scope.groupName);

    $http.get('/api/groups/'+ $scope.groupId).success(function(data){
      console.log('in promise of groupName is navbar: ', data);
      $scope.groupName = data.groupName;
      if(data.admin === $scope.getCurrentUser()._id) {
        $scope.isGroupAdmin = true;
        console.log('admin of the group');
      }
    })

    $scope.showAdmin = function() {
      $rootScope.$emit('show admin view')
    }
    $scope.showLeaderboard = function() {
      console.log('trying to show leaderboard in navbar controller')
      $rootScope.$emit('show leaderboard')
    }
    $scope.showCurrentActivity = function() {
      $rootScope.$emit('show current activity')
    }
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });