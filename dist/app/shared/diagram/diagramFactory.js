(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('diagramFactory', diagramFactory);

  diagramFactory.$inject = ['$rootScope', '$localStorage'];

  function diagramFactory($rootScope, $localStorage) {
    var diagram = function() {
      var diagramXML = $localStorage.default({ xml: '' }).xml;
      return {
        get: function () {
          return diagramXML;
        },
        save: function (diagram) {
          diagramXML = diagram;
          $rootScope.$emit('diagramSaved', {});
        }
      }
    };
    return diagram;
  }
})();
