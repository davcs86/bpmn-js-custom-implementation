'use strict';

var ScriptTaskDefinitionHelper = {},
    request = require('sync-request'),
    constants = require('./Constants');

module.exports = ScriptTaskDefinitionHelper;

/**
 * Call the service to retrieve the candidates for user tasks
 *
 * @method UserTaskDefinitionHelper#getAssignableCandidates
 *
 * @returns {Array} Array of candidates
 */
ScriptTaskDefinitionHelper.getAssignableBoots = function(configSettings) {
  var boots = [{id:1, Name:'none'}];
  try {
    var res = request('GET', configSettings.base_url + constants.BOOTS_URL);
    boots = JSON.parse(res.getBody('utf8'));
  } catch (err) {
    console.log(err);
  }
  return boots;
};

