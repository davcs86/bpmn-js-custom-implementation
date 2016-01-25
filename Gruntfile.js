'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // project configuration
  grunt.initConfig({
    config: {
      sources: 'lib',
      tests: 'test',
      dist: '../../PemworkBPMApp/PemworkBPMApp/Scripts/bpmn-js-custom-implementation'
    },
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: ['<%=config.sources %>'],
      options: {
        jshintrc: true
      }
    },
    bundle: {
      bpmnjs_custom: {
        modName: 'BpmnJSCustom',
        name: 'bpmn-js-custom-implementation',
        src: '<%= config.sources %>/index.js',
        dest: '<%= config.dist %>'
      }
    }
  });

  // tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('default', [ 'jshint', 'bundle' ]);
};
