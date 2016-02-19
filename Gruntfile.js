'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // project configuration
  grunt.initConfig({
    config: {
      sources: 'lib',
      tests: 'test',
      dist: 'dist/lib'
    },
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: ['<%=config.sources %>'],
      options: {
        jshintrc: true
      }
    },
    // Watch task config
    watch: {
      js: {
        files: "lib/**/*.js",
        tasks: ['default']
      }
    },
    // BrowserSync task config
    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            'lib/*.js',
            'app/*.js',
            '*.html'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: './dist'
          }
        }
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
  grunt.registerTask('browsersync-watch', [ 'browserSync', 'watch' ]);
};
