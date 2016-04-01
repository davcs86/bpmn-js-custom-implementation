'use strict';
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    selectBoxField = require('bpmn-js-properties-panel/lib/factory/SelectEntryFactory');
//textInputField = require('bpmn-js-properties-panel/lib/factory/TextInputEntryFactory'),
//    checkboxField = require('bpmn-js-properties-panel/lib/factory/CheckboxEntryFactory'),
//
//    comboBoxField = require('bpmn-js-properties-panel/lib/factory/ComboEntryFactory'),
//    textAreaField = require('bpmn-js-properties-panel/lib/factory/TextAreaEntryFactory'),
//    validationAwareTextInputField = require('bpmn-js-properties-panel/lib/factory/ValidationAwareTextInput'),
//    tableField = require('bpmn-js-properties-panel/lib/factory/TableEntryFactory'),
//    labelEntry = require('bpmn-js-properties-panel/lib/factory/LabelFactory'),
//    link = require('bpmn-js-properties-panel/lib/factory/LinkEntryFactory');



var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

// helpers ////////////////////////////////////////

function ensureNotNull(prop) {
  if(!prop) {
    throw new Error(prop + ' must be set.');
  }

  return prop;
}

/**
 * sets the default parameters which are needed to create an entry
 *
 * @param options
 * @returns {{id: *, description: (*|string), get: (*|Function), set: (*|Function),
 *            validate: (*|Function), html: string}}
 */
var setDefaultParameters = function ( options ) {

  // default method to fetch the current value of the input field
  var defaultGet = function (element) {
    var bo = getBusinessObject(element),
      res = {},
      prop = ensureNotNull(options.modelProperty);
    res[prop] = bo.get(prop);

    return res;
  };

// default method to set a new value to the input field
  var defaultSet = function (element, values) {
    var res = {},
      prop = ensureNotNull(options.modelProperty);
    if (values[prop] !== '') {
      res[prop] = values[prop];
    } else {
      res[prop] = undefined;
    }

    return cmdHelper.updateProperties(element, res);
  };

// default validation method
  var defaultValidate = function () {
    return {};
  };

  return {
    id : options.id,
    description : ( options.description || '' ),
    get : ( options.get || defaultGet ),
    set : ( options.set || defaultSet ),
    validate : ( options.validate || defaultValidate ),
    html: ''
  };
};

entryFactory.selectBox = function(options) {
  return selectBoxField(options, setDefaultParameters(options));
};

//entryFactory.textField = function(options) {
//  return textInputField(options, setDefaultParameters(options));
//};
//
//entryFactory.validationAwareTextField = function(options) {
//  return validationAwareTextInputField(options, setDefaultParameters(options));
//};
//entryFactory.checkbox = function(options) {
//  return checkboxField(options, setDefaultParameters(options));
//};
//
//entryFactory.textArea = function(options) {
//  return textAreaField(options, setDefaultParameters(options));
//};
//
//
//entryFactory.comboBox = function(options) {
//  return comboBoxField(options);
//};
//
//entryFactory.table = function(options) {
//  return tableField(options);
//};
//
//entryFactory.label = function(options) {
//  return labelEntry(options);
//};
//
//entryFactory.link = function(options) {
//  return link(options);
//};


module.exports = entryFactory;
