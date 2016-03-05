'use strict';

var TranslateModule = require('bpmn-js-i18next'),
    locales = require('./locales');

TranslateModule.translate[1].prototype.setOptions = function(i18next) {
  i18next.init({
    lng: 'es-MX',
    resources: locales.locales,
    fallbackLng: 'en-US',
    whitelist: locales.getKeys()
  });
};

module.exports = TranslateModule;