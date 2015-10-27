'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      style: {
        files: {
          'build/css/style.css': 'source/sass/style.scss'
        }
      },
      src: {
        files: {
          'source/css/style.css': 'source/sass/style.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
      },
      style: {
        src: 'build/css/style.css'
      }
    },

    csscomb: {
      style: {
        expand: true,
        src: ["source/sass/**/*.scss"]
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['build/img/**/*.{png,jpg,gif}']
        }]
      }
    },

    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'build/css/style.min.css': ['build/css/style.css']
        }
      }
    },

    htmlmin: {
      options: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        caseSensitive: true,
        keepClosingSlash: false
      },
      html: {
        files: {
          'build/index.min.html': 'build/index.html',
          'build/form.min.html': 'build/form.html',
          'build/blog.min.html': 'build/blog.html',
          'build/post.min.html': 'build/post.html'
        }
      }
    },

    clean: {
      build: ['build']
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'source',
          src: [
            'fonts/**',
            'img/**',
            '*.html'
          ],
          dest: 'build'
        }]
      }
    },

    cmq: {
      style: {
        files: {
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    bower_concat: {
      all: {
        mainFiles: {
          'moment': 'min/moment-with-locales.js'
        },
        dest: 'build/js/bower.js',
        cssDest: 'build/css/bower.css'
      }
    },

    concat: {
      js: {
        src: [
          'build/js/bower.js',
          'source/js/**/*.js'
        ],
        dest: 'build/js/script.js'
      }
    },

    concat_css: {
      files: {
        'build/css/style.css': 'build/css/**/*.css'
      }
    },

    uglify: {
      start: {
        files: {
          'build/js/script.min.js': ['build/js/script.js']
        }
      }
    },

    processhtml: {
      dist: {
        options: {
          process: true
        },
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**/*.html'],
          dest: 'build/',
          ext: '.html'
        }]
      }
    },

    watch: {
      style: {
        files: ['source/sass/**/*.scss'],
        tasks: ['sass:src'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  };

  grunt.registerTask('build', [
    'clean',
    'copy',
    'sass:style',
    'cmq',
    'postcss',
    'bower_concat',
    'concat_css',
    'concat',
    'processhtml',

    'cssmin',
    'imagemin',
    'htmlmin',
    'uglify'
  ]);


  config = require('./.gosha')(grunt, config);

  grunt.initConfig(config);
};
