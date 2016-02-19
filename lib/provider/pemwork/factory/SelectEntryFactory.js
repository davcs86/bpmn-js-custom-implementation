'use strict';

var forEach = require('lodash/collection').forEach,
    domQuery = require('min-dom/lib/query'),
    domAttr = require('min-dom/lib/attr'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    isUndefined = require('lodash/lang').isUndefined;

var isList = function(list) {
  return !(!list || Object.prototype.toString.call(list) !== '[object Array]');
};

var addEmptyParameter = function(list, concat) {
  if (!!concat){
    list = list.concat([{ name: '', value: '' }]);
  }
  return list;
};

var selectbox = function(options, defaultParameters) {
  var resource = defaultParameters,
    label = options.label || resource.id,
    allowEmpty = isUndefined(options.allowEmpty)? true : options.allowEmpty,
    selectOptions = (isList(options.selectOptions)) ? addEmptyParameter(options.selectOptions, allowEmpty)
                    : [ { name: '', value: '' }],
    modelProperty = options.modelProperty;

  resource.html =
    '<label for="pemwork-' + resource.id + '">' + label + '</label>' +
    '<select id="pemwork-' + resource.id + '" name="' + options.modelProperty + '">';

  forEach(selectOptions, function(option){
    resource.html += '<option value="' + option.value + '">' + option.name + '</option>';
  });

  resource.html += '</select>';

  resource.get = function(element, propertyName) {
    var businessObject = getBusinessObject(element),
        boValue = businessObject.get(modelProperty) || '',
        elementFields = domQuery.all('select#pemwork-' + resource.id + ' > option', propertyName);

    forEach(elementFields, function(field) {
      if(field.value === boValue) {
        domAttr(field, 'selected', 'selected');
      } else {
        domAttr(field, 'selected', null);
      }
    });
  };

  resource.cssClasses = ['dropdown'];

  return resource;
};

module.exports = selectbox;
