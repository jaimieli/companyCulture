'use strict';

describe('Service: userGroup', function () {

  // load the service's module
  beforeEach(module('companyCultureApp'));

  // instantiate service
  var userGroup;
  beforeEach(inject(function (_userGroup_) {
    userGroup = _userGroup_;
  }));

  it('should do something', function () {
    expect(!!userGroup).toBe(true);
  });

});
