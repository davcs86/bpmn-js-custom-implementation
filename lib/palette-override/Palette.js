'use strict';

var inherits = require('inherits'),
    BasePalette = require('diagram-js/lib/features/palette/Palette');

var domify = require('min-dom/lib/domify'),
  domQuery = require('min-dom/lib/query'),
  domMatches = require('min-dom/lib/matches'),
  domDelegate = require('min-dom/lib/delegate'),
  domEvent = require('min-dom/lib/event');


var toggleSelector = '.djs-palette-toggle',
  entrySelector = '.entry',
  elementSelector = toggleSelector + ', ' + entrySelector;

function Palette(config, eventBus, dragging) {
  this._parent = config.parent;
  BasePalette.call(this, eventBus, {}, dragging);
}

inherits(Palette, BasePalette);

/**
 * Override init method
 */
Palette.prototype._init = function() {
  var parent = domQuery(this._parent),
    container = this._container = domify(BasePalette.HTML_MARKUP),
    self = this;

  parent.appendChild(container);

  domDelegate.bind(container, elementSelector, 'click', function(event) {

    var target = event.delegateTarget;

    if (domMatches(target, toggleSelector)) {
      return self.toggle();
    }

    self.trigger('click', event);
  });

  // prevent drag propagation
  domEvent.bind(container, 'mousedown', function(event) {
    event.stopPropagation();
  });

  // prevent drag propagation
  domDelegate.bind(container, entrySelector, 'dragstart', function(event) {
    self.trigger('dragstart', event);
  });

  this._eventBus.fire('palette.create', {
    html: container
  });
};

Palette.$inject = [ 'config.paletteOverride', 'eventBus', 'dragging' ];

module.exports = Palette;