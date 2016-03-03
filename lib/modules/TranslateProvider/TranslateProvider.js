'use strict';

var inherits = require('inherits'),
    BaseTranslateProvider = require('bpmn-js/lib/features/translate/TranslateProvider');

function TranslateProvider(eventBus){
  BaseTranslateProvider.call(this, eventBus);
}

inherits(TranslateProvider, BaseTranslateProvider);

TranslateProvider.$inject = ['eventBus'];

TranslateProvider.prototype.t = function(){
  console.log('translate override');
  /*
   * here your translation override
   */
  return arguments[0];
};

TranslateProvider.prototype.applyLanguage = function() {
  console.log('Apply language');
  /*
   * your custom code
   */
  BaseTranslateProvider.prototype.applyLanguage.call(this);
};



module.exports = TranslateProvider;