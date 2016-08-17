/* jshint node: true */
'use strict';

let babel = require('rollup-plugin-babel'),
    includePaths = require('rollup-plugin-includepaths'),
    js_ignores = [
        '!pages/static/js/build/**',
        '!pages/static/js/temp/**',
        '!pages/static/js/vendor/**',
    ],
    js_apps = [
        'pages/static/js',
        'contact/static/js'
    ],
    srcFromApps = function(filepath) { 
        let src = [];
        for (var app of js_apps) {
            src.push(app + '/' + filepath);
        }
        return src;
    };

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {
            media: {
                files: [{
                    expand: true,
                    cwd: 'media/images/',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: 'media/images'
                }]
            }
        },

        clean: {
            build: 'pages/static/js/build/*',
            temp: 'pages/static/js/temp/*',
            all: [
                'pages/static/js/build/*',
                'pages/static/js/temp/*'
            ]
        },
        bgShell: {
            _defaults: {
                bg: true
            },
            livereload: {
                cmd: 'python manage.py runserver livereload'
            },
            runserver: {
                cmd: 'python manage.py runserver'
            }
        },
        jshint: {
            options: {
                esversion: 6
            },
            all: {
                src: srcFromApps('**/*.js').concat(js_ignores)
            }
        },
        concat: {
            js: {
                src: srcFromApps('**/app.js').concat(js_ignores),
                dest: 'pages/static/js/temp/main.js'
            }
        },
        rollup: {
            dev: {
                options: {
                    format: 'es',
                    plugins: function() {
                        return [
                            includePaths({
                                paths: js_apps
                            })
                        ];
                    }
                },
                files: [{
                    src: 'pages/static/js/temp/main.js',  // May only contain 1 src.
                    dest: 'pages/static/js/build/main.js',
                }]
            },
            build: {
                options: {
                    format: 'es',
                    sourceMap: true,
                    plugins: function() {
                        return [
                            includePaths({
                                paths: js_apps
                            }),
                            babel({compact: false})
                        ];
                    }
                },
                files: [{
                    src: 'pages/static/js/temp/main.js',  // May only contain 1 src.
                    dest: 'pages/static/js/build/main.js',
                }]
            }
            
        },
        watch: {
            js: {
                tasks: ['diff_dev'],
                files: srcFromApps('**/*.js').concat(js_ignores)
            }
        }
    });
    grunt.loadNpmTasks('grunt-bg-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('diff_dev', 
        "Join and rollup all the ES6, but don't transpile.", 
        ['newer:jshint:all', 'clean:build', 'concat:js', 'rollup:dev']
    );
    grunt.registerTask('build',
        "Join, rollup, transpile, and uglify static JavaScript assets",
        ['jshint:all', 'clean:all', 'concat:js', 'rollup:build']
    );
    grunt.registerTask('dev',
        ['bgShell:livereload', 'watch']
    );

    // From project
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default', ['imagemin']);
};

