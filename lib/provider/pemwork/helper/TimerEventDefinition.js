'use strict';

var TimerEventDefinitionHelper = {};

module.exports = TimerEventDefinitionHelper;

/**
 * Clean a TimerEventDefinition expression based on a custom format
 *
 * @method TimerEventDefinition#cleanExpression
 *
 * @param {String} expressionStr - TimerEventDefinition expression to clean
 *
 * @returns {String} element which is created
 */
/*jshint ignore:start*/
TimerEventDefinitionHelper.customExpressionFormat = /^([0-5])\|(2[0-1][\d]{2}-[0-1][\d]-[0-3][\d]\s[\d]{2}:[\d]{2}:[\d]{2})\|((1)\|([\d]+)\|(([\d]+\-){4}[\d]+)|(2)\|([\d]+)\|(([\d]+-){2}[\d]+))$/;
var toString = require('lodash/lang').toString,
    moment = require('moment'),
    toInteger = require('lodash/lang').toInteger,
    mapArray = require('lodash/collection').map;

TimerEventDefinitionHelper.cleanExpression = function(expressionStr) {
  /**
   * Possible values:
   * #|YYYY-MM-DD HH:mm:ss|1|#|##-##-##-##-##
   * #|YYYY-MM-DD HH:mm:ss|2|#|##-##-##
   */

  // convert to string w/lodash
  expressionStr = toString(expressionStr);
  if (!expressionStr.match(TimerEventDefinitionHelper.customExpressionFormat)){
      expressionStr='';
  }
  return expressionStr;
};
/**
 * Clean a TimerEventDefinition expression based on a custom format
 *
 * @method TimerEventDefinition#cleanExpression
 *
 * @param {String} expressionStr - TimerEventDefinition expression to clean
 *
 * @returns {String} element which is created
 */
TimerEventDefinitionHelper.expressionToObj = function(expressionStr, timerEventDefinitionType) {
    // convert to string w/lodash
    expressionStr = toString(expressionStr);
    // set the default values
    var retObj = TimerEventDefinitionHelper.exprToObjDefaultVals(timerEventDefinitionType);
    var matches = expressionStr.match(TimerEventDefinitionHelper.customExpressionFormat);
    if (matches) {
        // create and fill the object
        retObj = { tab: toInteger(matches[1]) };
        retObj['start_date'] = matches[2];
        if (matches[4] === '1'
                && (
                    retObj['tab'] === 1 // minute
                    || retObj['tab'] === 2 // hour
                    || retObj['tab'] === 3 // day
                )
                && (
                    timerEventDefinitionType === 'timeCycle' // for cycle definition
                    || timerEventDefinitionType === 'timeDuration' // for duration definition
                )
            ) {
            retObj['type'] = 1; // type of expression
            retObj['repetitions'] = toInteger(matches[5]);
            retObj['interval'] = mapArray(matches[6].split('-', 5), toInteger);
            if (timerEventDefinitionType === 'timeDuration') {
                // duration is just a cycle of 1 repetition
                retObj['repetitions'] = 1;
            }
        } else if (matches[4] === '1'
                        && retObj['tab'] === 0 // fixed date
                        && timerEventDefinitionType === 'timeDate' // for fixed date definition
                  ) {
            retObj['type'] = 1; // type of expression
            retObj['repetitions'] = 1;
            retObj['interval'] = [0, 0, 0, 0, 0];
        } else if (matches[8] === '2'
                        && (
                            retObj['tab'] === 4 // week
                            || retObj['tab'] === 5  // month
                        )
                        && timerEventDefinitionType === 'timeCycle' // for cycle definition
                  ) {
            retObj['type'] = 2; // type of expression
            retObj['repetitions'] = toInteger(matches[9]);
            retObj['interval'] = mapArray(matches[10].split('-', 3), toInteger);
        } else {
            // didn't meet the conditions
            // return to the default values
            retObj = TimerEventDefinitionHelper.exprToObjDefaultVals(timerEventDefinitionType);
        }
    }
    return retObj;
};
TimerEventDefinitionHelper.exprToObjDefaultVals = function(timerEventDefinitionType) {
    var retObj = {};
    if (timerEventDefinitionType === 'timeDate') {
        retObj = {
            tab: 0, // fixed date
            start_date: moment().format('YYYY-MM-DD HH:mm:00'),
            type: 1,
            repetitions: 1,
            interval: [0, 0, 0, 0, 0]
        };
    } else if (timerEventDefinitionType === 'timeDuration' || timerEventDefinitionType === 'timeCycle') {
        retObj = {
            tab: 1, // after XX minutes
            start_date: moment().format('YYYY-MM-DD HH:mm:00'),
            type: 1,
            repetitions: 1,
            interval: [0, 0, 0, 0, 1] // 1 minute
        };
    }
    return retObj;
}
TimerEventDefinitionHelper.objectToExpression = function(timerEventDefinitionObj) {
    var retval = '';
    retval += (timerEventDefinitionObj.tab || '0') + '|';
    retval += (timerEventDefinitionObj.start_date || '') + '|';
    retval += (timerEventDefinitionObj.type || '') + '|';
    retval += (timerEventDefinitionObj.repetitions || '') + '|';
    retval += (timerEventDefinitionObj.interval || []).join('-');
    return retval;
}
/*jshint ignore:end*/
/**
 * Generate a TimerEventDefinition expression based on a element node
 *
 * @method TimerEventDefinition#createExpression
 *
 * @param {String} elementNode - element node
 *
 * @returns {String} expression generated
 */
TimerEventDefinitionHelper.createExpression = function(elementNode) {
  var expressionStr = '----';
  return expressionStr;
};
