/*global module:false*/
module.exports = function(grunt) {
    'use strict';

    var EMPTY = 'empty:';

    grunt.registerHelper("include", function (patterns, regexp, replace) {
        regexp = new RegExp(regexp);

        return grunt.utils._.map(grunt.file.expandFiles(patterns), function (file) {
            return file.replace(regexp, replace);
        });
    });


    // load grunt-contrib tasks
    grunt.loadNpmTasks('grunt-contrib');

    // Project configuration.
    grunt.initConfig({
        clean: ['dist/**'],

        less: {
            production: {
                options: {
                    paths: ['src/css'],
                    yuicompress: true
                },
                files: {
                    'dist/css/main.css': 'src/css/ets-global.less'
                }
            }
        },

        copy: {
            dist: {
                files: {
                    'dist/img/': 'src/img/**',
                    'dist/js/': 'src/js/**'
                }
            }
        },

        requirejs : {
            compile : {
                options : {
                    paths: {
                        'compose': EMPTY,
                        "troopjs-core" : EMPTY,
                        "troopjs-utils" : EMPTY,
                        "troopjs-bundle" : EMPTY,
                        'jquery': EMPTY,
                        'jquery.ui': EMPTY,
                        'jquery.etsCheckbox': EMPTY,
                        'jquery.counter': EMPTY,
                        'troopjs-requirejs/template': 'src/js/resource/troopjs/troopjs-requirejs/template'
                    },
                    "map" : {
                        "*" : {
                            "template" : "troopjs-requirejs/template"
                        }
                    },
                    mainConfigFile : "src/js/app.js",
                    out: 'dist/js/built.js',
                    include : grunt.utils._.union(grunt.helper("include", "src/js/**/*.js", ".*/js/(.+)\\.js", "$1")),
                    exclude: ["troopjs-requirejs/template", 'config.js', 'app.js', 'ets-checkbox.js'],
                    optimize : "none",
                    useStrict: true
                }
            }
        },

        lint: {
            beforerequire: ['grunt.js', 'src/js/widget/*.js'],
            afterrequire: ['<%= requirejs.compile.options.out %>']
        },

        min: {
            dist : {
                src : ['<%= requirejs.compile.options.out %>'],
                dest : "dist/js/built.min.js"
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                console: false,
                plusplus: false,
                strict: true,
                es5: true,
                debug: false,
                validthis: true
            },
            globals: {
                jQuery: true,
                $: true,
                define: true,
                _: true
            }
        },
    });

    // Default task.
    grunt.registerTask('default', 'clean lint:beforerequire less:production requirejs copy');

};
