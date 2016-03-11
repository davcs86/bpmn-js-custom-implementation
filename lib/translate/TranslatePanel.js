'use strict';

var i18next = require('i18next'),
    locales = require('./locales');

i18next.init({
    lng: 'es-MX',
    resources: locales.locales,
    fallbackLng: 'en-US',
    whitelist: locales.getKeys()
});

module.exports = i18next;