'use strict';

var locales = require('./locales');

function Translate(i18nextHelper){
  i18nextHelper._i18next.init({
      lng: 'es-MX',
      resources: locales.locales,
      fallbackLng: 'en-US',
      whitelist: locales.getKeys()
    });
  return function translate(template, replacements){
    return i18nextHelper.translate(template, replacements);
  };
}

Translate.$inject = [ 'i18nextHelper' ];

module.exports = Translate;