'use strict';

var readOnlyField = function(options, defaultParameters) {
  var resource = defaultParameters,
    label = options.label || resource.id;
  resource.html =
      'ddd:'+label;
  return resource;
};

module.exports = readOnlyField;
