(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('spinnerFactory', spinnerFactory);

  //spinnerFactory.$inject = [];

  function spinnerFactory() {
    var spinner = {
      show: function(){
        this.visible = true;
      },
      hide: function(){
        this.visible = false;
      },
      visible: false
    };
    return spinner;
  }
})();
