'use strict';

angular.module('companyCultureApp')
  .factory('navbar', function () {
    // Public API here
    var isAdmin;
    var groupName;
    return {
      setAdminStatus: function (bool) {
        console.log('set admin to: ', bool)
        isAdmin = bool;
      },
      getAdminStatus: function() {
        return isAdmin;
      },
      setGroupName: function(name){
        console.log('set group to: ', name);
        groupName = name;
      },
      getGroupName: function() {
        return groupName;
      }
    };
  });
