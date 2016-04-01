'use strict';

var inherits = require('inherits'),
    BasePropertiesPanel = require('bpmn-js-properties-panel/lib/PropertiesPanel');

function PropertiesPanel(config, eventBus, modeling, propertiesProvider, commandStack, canvas) {
  BasePropertiesPanel.call(this, config, eventBus, modeling, propertiesProvider, commandStack, canvas);
}

inherits(PropertiesPanel, BasePropertiesPanel);

PropertiesPanel.prototype._init = function(config){
  var eventBus = this._eventBus;
  var self = this;
  eventBus.on('i18n.changed', function() {
    var element = self._current.element;
    if (element) {
      self._current.element = null;
      self.update(element);
    }
  });
  this.constructor.super_.prototype._init.call(this, config);
};


PropertiesPanel.$inject = [
  'config.propertiesPanel',
  'eventBus',
  'modeling',
  'propertiesProvider',
  'commandStack',
  'canvas' ];



module.exports = PropertiesPanel;