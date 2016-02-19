'use strict';

var UserTaskDefinitionHelper = {},
    request = require('sync-request'),
    constants = require('./constants');

module.exports = UserTaskDefinitionHelper;

/**
 * Call the service to retrieve the candidates for user tasks
 *
 * @method UserTaskDefinitionHelper#getAssignableCandidates
 *
 * @returns {Array} Array of candidates
 */
UserTaskDefinitionHelper.getAssignableCandidates = function() {
  var candidates = [];
  try {
    var res = request('GET', constants.CANDIDATES_URL);
    candidates = JSON.parse(res.getBody('utf8'));
  } catch (err) {
    console.log(err);
  }
  return candidates;
};

