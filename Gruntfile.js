module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            release: [ 'public/prod' ]
        },

        copy: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/dev/',
                        src: [
                            'index.html',
                            'assets/**',
                            'mobile/fireworks/index.html'
                        ],
                        dest: 'public/prod/'
                    },
                    {
                        expand: true,
                        cwd: 'public/dev/vendors/bootstrap/dist',
                        src: 'fonts/**',
                        dest: 'public/prod/'
                    },
                    {
                        expand: true,
                        cwd: 'public/dev/vendors/devicons',
                        src: 'fonts/**',
                        dest: 'public/prod/'
                    }
                ]
            }
        },

        ngtemplates: {
            'adluxe': {
                src: 'public/dev/views/**.html',
                dest: 'public/dev/js/templates.js',
                options: {
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            }
        },

        usemin: {
            html: [
                'public/prod/index.html',
                'public/prod/mobile/fireworks/index.html'
            ]
        },

        uglify: {
            release: {
                options: {
                    compress: true,
                    report: 'gzip',
                    mangle: true
                },
                files: {
                    'public/prod/js/app.min.js': [
                        'public/dev/js/adluxe-core.js',
                        'public/dev/js/adluxe-fireworks.js',
                        'public/dev/js/templates.js',
                        'public/dev/js/app.js'
                    ],
                    'public/prod/js/vendors.min.js': [
                        'public/dev/vendors/angular/angular.js',
                        'public/dev/vendors/angular-route/angular-route.js',
                        'public/dev/vendors/socket.io-client/socket.io.js',
                        'public/dev/vendors/phaser-official/phaser.js'
                    ],
                    'public/prod/mobile/fireworks/js/app.min.js': [
                        'public/dev/js/adluxe-core.js',
                        'public/dev/mobile/fireworks/js/app.js'
                    ],
                    'public/prod/mobile/fireworks/js/vendors.min.js': [
                        'public/dev/vendors/socket.io-client/socket.io.js',
                        'public/dev/vendors/angular-touch/angular-touch.js',
                        'public/dev/vendors/angular/angular.js'
                    ]
                }
            }
        },

        cssmin: {
            release: {
                expand: true,
                files: {
                    'public/prod/css/styles.min.css': [
                        'public/vendors/devicons/css/devicons.css',
                        'public/vendors/bootstrap/prod/css/bootstrap.css',
                        'public/css/styles.css'
                    ],
                    'public/prod/mobile/fireworks/css/styles.min.css': [
                        'public/mobile/fireworks/css/styles.css'
                    ]
                }
            }
        },

        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            files: {
                src: [
                    'public/prod/js/*.min.js',
                    'public/prod/css/*.min.css',
                    'public/prod/mobile/fireworks/js/*.min.js',
                    'public/prod/mobile/fireworks/css/*.min.css'
                ]
            }
        },

        jshint: {
            files: [ 'public/js/*.js', 'public/mobile/fireworks/js/*.js' ]
        }
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-rev');

    grunt.registerTask('validate', [ 'jshint' ]);
    grunt.registerTask('release', [ 'validate', 'clean', 'ngtemplates', 'cssmin', 'uglify', 'copy', 'rev', 'usemin' ]);
};