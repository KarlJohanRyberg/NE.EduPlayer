module.exports = function(grunt) {

    var debug = !!grunt.option('debug');

    // configure the tasks
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'source/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                },
                undef: false,
                unused: false,
                nonstandard: true,
                sub: true,
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'jshint-report.html',
                force: false,
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'source/**/*.css', 'source/**/*.html'],
            tasks: ['compile']
        },

        copy: {
        build: {
                cwd: 'source',
                src: ['images/*',
                        'scripts/libraries/**/*',
                        'scripts/components/**/*',
                        '!scripts/components/**/*.js',
                        '!scripts/components/**/*.css'],
                dest: 'dist',
                expand: true
            }
        },

        clean: {
            build: {
                src: ['dist']
            }
        },

        cssmin: {
            target: {
                files: {
                    'dist/css/NE.EduPlayer.min.css': 
                    ['source/**/*.css']
                }
            }
        },

        uglify: {
            Mainfiles: {
                files: {
                    'dist/scripts/NE.EduPlayer.min.js': 
                    ['source/scripts/*.js']
                },
                options: {
                    mangle: false,
                    compress: {
                        global_defs: {
                            DEBUG: debug
                        }
                    }
                }
            }
        }

    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // define the tasks


    grunt.registerTask(
        'compileComponents',
        'iterates over all module directories and compiles the components',
        function() {

    grunt.file.expand('source/scripts/components/*').forEach(function(dir) {


                var uglifyConfig = grunt.config.get('uglify');


                var compName = dir.split('/').pop();

                var inName = dir + '/' + compName + '.js';
                var dependencies = dir + '/' + compName + '.*.js';
                var outName = 'dist/scripts/components/' + compName + '/' + compName + '.js';
                var filesObj = {};
                filesObj[outName] = [inName, dependencies];
                uglifyConfig[compName] = {};
                uglifyConfig[compName]['files'] = filesObj;
                uglifyConfig[compName]['options'] = {
                    mangle: false,
                    compress: {
                        global_defs: {
                            DEBUG: debug
                        }
                    }
                };

                grunt.config.set('uglify', uglifyConfig);


                var cssminConfig = grunt.config.get('cssmin');
                cssminConfig['target']['files']['dist/scripts/components/' + compName + '/' + compName + '.css'] = [dir + '/' + compName + '*.css'];

                grunt.config.set('cssmin', cssminConfig);

            });

        });


    grunt.registerTask(
        'final',
        'Compiles all of the assets and copies the files to the build directory.',
        ['clean', 'copy', 'uglify']
    );
    
    grunt.registerTask(
        'default',
        'Default task. Compile compnents and build',
        ['watch']
    );

    grunt.registerTask(
        'compile',
        'compile task. Compile compnents and build',
        ['jshint', 'compileComponents', 'final', 'cssmin']
    );

};