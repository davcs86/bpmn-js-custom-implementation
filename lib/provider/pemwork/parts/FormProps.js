'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
// getExtensionElements = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements,
//extensionElements = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements'),
    getExtensionElements = require('../helper/ExtensionElementsHelper').getExtensionElements,
    extensionElements = require('./implementation/ExtensionElements'),
   // properties = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Properties'),
    entryFactory = require('../factory/EntryFactory'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    formHelper = require('../helper/FormHelper'),
    utils = require('bpmn-js-properties-panel/lib/Utils'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    isUndefined = require('lodash/lang').isUndefined;

//function generateValueId() {
  //return utils.nextId('Value_');
//}

/**
 * Generate a form field specific textField using entryFactory.
 *
 * @param  {string} options.id
 * @param  {string} options.label
 * @param  {string} options.modelProperty
 * @param  {function} options.validate
 *
 * @return {Object} an entryFactory.textField object
 */
function formFieldTextField(options, getSelectedFormField) {

  var id = options.id,
      label = options.label,
      modelProperty = options.modelProperty,
      validate = options.validate;

  return entryFactory.textField({
    id: id,
    label: label,
    modelProperty: modelProperty,
    get: function(element, node) {
      var selectedFormField = getSelectedFormField(element, node) || {},
          values = {};

      values[modelProperty] = selectedFormField[modelProperty];

      return values;
    },

    set: function(element, values, node) {
      var commands = [];

      if (typeof options.set === 'function') {
        var cmd = options.set(element, values, node);

        if (cmd) {
          commands.push(cmd);
        }
      }

      var formField = getSelectedFormField(element, node),
          properties = {};

      properties[modelProperty] = values[modelProperty];

      commands.push(cmdHelper.updateBusinessObject(element, formField, properties));

      return commands;
    },

    disabled: function(element, node) {
     // var root = elementRegistry.getAll()[0];
      return formHelper.getFormType(element) === 'form-key' ||
             !getSelectedFormField(element, node);
    },
    validate: validate
  });
}

function ensureFormKeyAndDataSupported(element) {
  return is(element, 'bpmn:Process') || is(element, 'bpmn:Collaboration');
 // return (is(element.parent, 'bpmn:Process'));
}

module.exports = function(group, element, bpmnFactory, elementRegistry, translate) {

  if (!ensureFormKeyAndDataSupported(element)) {
    return;
  }

  /**
   * Return the currently selected form field querying the form field select box
   * from the DOM.
   *
   * @param  {djs.model.Base} element
   * @param  {DOMElement} node - DOM element of any form field text input
   *
   * @return {ModdleElement} the currently selected form field
   */
  function getSelectedFormField(element, node) {
    var selected = formFieldsEntry.getSelected(element, node.parentNode);
    console.log("-------selected------------------");
    console.log(selected);
    if (selected.idx === -1) {
      return;
    }

    return formHelper.getFormField(element, selected.idx);
  }

  // form type select box
  group.entries.push({
    id: 'form-type',
    html: '<div class="pp-row pp-hidden">' +
            '<label for="camunda-form-type">Form Type</label>' +
            '<div class="pp-field-wrapper">' +
              '<select id="camunda-form-type" name="formType" data-value>' +
                '<!--<option value="form-key">Form Key</option>-->' +
                '<option value="form-data">Form Data</option>' +
              '</select>' +
            '</div>' +
          '</div>',
    get: function(element, node) {
      return {
        formType: formHelper.getFormType(element)
      };
    },
    set: function(element, values, node) {
      var root = elementRegistry.getRootElement();

      var bo = getBusinessObject(root);

      //if (values.formType === 'form-key') {
      //  // Form Key is selected in the select box
      //  var entry = getExtensionElements(bo, 'camunda:FormData');
      //
      //  return cmdHelper.removeElementsFromList(element, bo.extensionElements, 'values', 'extensionElements', entry);
      //} else {
        // Form Data is selected in the select box
        var commands = [];

        commands.push(cmdHelper.updateBusinessObject(element, bo, { 'camunda:formKey': undefined }));

        var extensionElements = bo.get('extensionElements');
        if (!extensionElements) {
          extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
          commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
        }

        var formData = elementHelper.createElement('camunda:FormData', { fields: [] }, extensionElements, bpmnFactory);
        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [ formData ],
          []
        ));

        return commands;
      //}
    }
  });

  //// [FormKey] form key text input field
  //group.entries.push(entryFactory.textField({
  //  id : 'form-key',
  //  label : 'Form Key',
  //  modelProperty: 'formKey',
  //  get: function(element, node) {
  //    var bo = getBusinessObject(element);
  //
  //    return {
  //      formKey: bo.get('camunda:formKey')
  //    };
  //  },
  //  set: function(element, values, node) {
  //    var bo = getBusinessObject(element),
  //        formKey = values.formKey || undefined;
  //
  //    return cmdHelper.updateBusinessObject(element, bo, { 'camunda:formKey': formKey });
  //  },
  //  disabled: function(element, node) {
  //    return formHelper.getFormType(element) === 'form-data';
  //  }
  //}));

  // [FormData] form field select box
  var formFieldsEntry = extensionElements(element, bpmnFactory, {
    id : 'form-fields',
    label : 'Form Fields',
    modelProperty: 'id',
    prefix: 'FormField',
    createExtensionElement: function(element, extensionElements, value){
      var root = elementRegistry.getAll()[0];

      var bo = getBusinessObject(root),
          formData = getExtensionElements(bo, 'camunda:FormData'),
          field = elementHelper.createElement('camunda:FormField', { id: value }, formData, bpmnFactory),
          commands = [];

      if (isUndefined(formData)){
        commands.push(cmdHelper.updateBusinessObject(root, bo, { 'camunda:formKey': undefined }));

        extensionElements = bo.get('extensionElements');
        if (!extensionElements) {
          extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
          commands.push(cmdHelper.updateProperties(root, { extensionElements: extensionElements }));
        }
        formData = elementHelper.createElement('camunda:FormData',
                    { fields: [ field ] }, extensionElements, bpmnFactory);

        commands.push(cmdHelper.addAndRemoveElementsFromList(
            root,
            extensionElements,
            'values',
            'extensionElements',
            [ formData ],
            []
        ));
      } else {
        formData = formData[0];
        if (typeof formData.fields !== 'undefined') {
          commands.push(cmdHelper.addElementsTolist(root, formData, 'fields', [ field ]));
        } else {
          commands.push(cmdHelper.updateBusinessObject(root, formData, {
            fields: [ field ]
          }));
        }
      }

      return commands;
    },
    removeExtensionElement: function(element, extensionElements, value, idx) {
      var root = elementRegistry.getAll()[0];


     // var bo = getBusinessObject(root);
      console.log(root);
      console.log(idx);
      //var formData = getExtensionElements(bo, 'camunda:FormData'),
      //    entry = formData.fields[idx];



      var formData = getExtensionElements(getBusinessObject(element), 'camunda:FormData')[0],
          entry = formData.fields[idx];


      return cmdHelper.removeElementsFromList(element, formData, 'fields', null, [ entry ]);
    },
    getExtensionElements: function(element) {
      var root = elementRegistry.getAll()[0];
      return formHelper.getFormFields(root);
    },
    hideExtensionElements: function(element, node) {
      var root = elementRegistry.getAll()[0];
      return formHelper.getFormType(root) === 'form-key';
    }
  });
  group.entries.push(formFieldsEntry);

  // [FormData] Form Field label
  group.entries.push(entryFactory.label({
    id: 'form-field-header',
    labelText: 'Form Field',
    showLabel: function(element, node) {
      var root = elementRegistry.getAll()[0];
      return formHelper.getFormType(root) === 'form-data' && !!getSelectedFormField(root, node);
    }
  }));

  // [FormData] form field id text input field
  group.entries.push(entryFactory.validationAwareTextField({
    id: 'form-field-id',
    label: 'ID',
    modelProperty: 'id',

    getProperty: function(element, node) {


      var selectedFormField = getSelectedFormField(element, node) || {};

      return selectedFormField.id;
    },

    setProperty: function(element, properties, node) {
      var formField = getSelectedFormField(element, node);

      return cmdHelper.updateBusinessObject(element, formField, properties);
    },
    disabled: function(element, node) {
      var root = elementRegistry.getAll()[0];
      return formHelper.getFormType(element) === 'form-key'|| !getSelectedFormField(root, node);
    },
    validate: function(element, values, node) {

      var formField = getSelectedFormField(element, node);

      if (formField) {
        var idValue = values.id;

        var idError = utils.isIdValid(formField, idValue);

        if (idError) {
          return { id: idError };
        }
      }
    }
  }));

  // [FormData] form field type combo box
  group.entries.push(entryFactory.comboBox({
    id : 'form-field-type',
    label: 'Type',
    selectOptions: [
      { name: 'File', value: 'File' },
      { name: 'Double', value: 'Double' },
      { name: 'Boolean', value: 'Boolean' },
      { name: 'String', value: 'String' }
    ],
    modelProperty: 'type',
    emptyParameter: true,

    get: function(element, node) {
      var selectedFormField = getSelectedFormField(element, node);

      if (selectedFormField) {
        return { type: selectedFormField.type };
      } else {
        return {};
      }
    },
    set: function(element, values, node) {
      var selectedFormField = getSelectedFormField(element, node),
          commands = [];

      if (selectedFormField.type === 'enum' && values.type !== 'enum') {
        // delete camunda:value objects from formField.values when switching from type enum
        commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, { values: undefined }));
      }

      commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, values));

      return commands;
    },
    disabled: function(element, node) {
      var root = elementRegistry.getAll()[0];
      return formHelper.getFormType(element) !== 'form-data' || !getSelectedFormField(root, node);
    }
  }));

  // [FormData] form field label text input field
  group.entries.push(formFieldTextField({
    id : 'form-field-label',
    label : 'Label',
    modelProperty: 'label'
  }, getSelectedFormField));

  // [FormData] form field defaultValue text input field
  group.entries.push(formFieldTextField({
    id : 'form-field-defaultValue',
    label : 'Default Value',
    modelProperty: 'defaultValue'
  }, getSelectedFormField));
};