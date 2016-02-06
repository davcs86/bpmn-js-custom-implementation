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
TimerEventDefinitionHelper.cleanExpression = function(expressionStr) {
  /**
   * Possible values:
   * #|YYYY-MM-DD-HH-mm|1|#|##-##-##-##-##
   * #|YYYY-MM-DD-HH-mm|2|#|##-##-##
   */
  var customExpressionFormat = /^[\d]\|[\d]{4}-[\d]{2}-[\d]{2}-[\d]{2}-[\d]{2}\|(1\|[\d]+\|([\d]+-){4}[\d]+|2\|[\d]+\|([\d]+-){2}[\d]+)$/;
  if (!expressionStr.match(customExpressionFormat)){
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
TimerEventDefinitionHelper.expressionToObj = function(expressionStr) {

}

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
  var expressionStr = "-----";
  return expressionStr;
};
