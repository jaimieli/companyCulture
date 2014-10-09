'use strict';

angular.module('companyCultureApp')
  .factory('userGroup', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      groups: [],
      getUserGroups: function () {
        var self = this;
        return $http.get('/api/users/getGroups').success(function(data){
          self.userGroupsObj = data;
          angular.copy(data.groups,self.groups);
        });
      },
      userGroupsObj: {}
    };
  });
