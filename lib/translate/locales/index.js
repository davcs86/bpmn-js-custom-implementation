'use strict';
module.exports = {
  getKeys: function() {
    var keys = []; for(var k in this.locales) { keys.push(k); }
    return keys;
  },
  locales: {
    'es-MX': require('./es-MX')
  }
};