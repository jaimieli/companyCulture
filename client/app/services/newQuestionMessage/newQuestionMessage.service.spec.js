'use strict';

describe('Service: newQuestionMessage', function () {

  // load the service's module
  beforeEach(module('companyCultureApp'));

  // instantiate service
  var newQuestionMessage;
  beforeEach(inject(function (_newQuestionMessage_) {
    newQuestionMessage = _newQuestionMessage_;
  }));

  it('should do something', function () {
    expect(!!newQuestionMessage).toBe(true);
  });

});
