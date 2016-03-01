(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('spinnerFactory', spinnerFactory);

  spinnerFactory.$inject = ['$rootScope'];

  function spinnerFactory($rootScope) {
    var spinner = {
      show: function(){
        this.visible = true;
        this.emit();
      },
      hide: function(){
        this.visible = false;
        this.emit();
      },
      emit: function(){
        $rootScope.$emit('spinnerChanged', this.visible);
      },
      visible: false
    };
    return spinner;
  }
})();
