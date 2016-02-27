(function() {
  'use strict';
  /**
   * Simple directive to read as text a selected file
   * @params {object}
   */
  angular
    .module('davcs86.fileUpload')
    .directive('fileUpload', fileUpload);

  //fileUpload.$inject = [];

  function fileUpload() {
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    var onChange = function() {
          var files = event.target.files;
          [].forEach.call(files, processFile);
        },
        processFile = function(file){
          var reader = new FileReader();
          reader.onload = function (e) {
            onChangeFunc(e.target.result);
          };
          reader.readAsText(file);
        },
        onChangeFunc = function() {};
    function link(scope, element, attrs) {
      onChangeFunc = scope.$eval(attrs.fileUploadFunc);
      element.bind('change', onChange);
    }
  }

})();