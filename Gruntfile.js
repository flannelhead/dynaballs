module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    'dynaballs.min.js': ['src/*.js']
                }
            }
        },

        cssmin: {
            build: {
                files: {
                    'dynaballs.min.css': ['src/dynaballs.css']
                }
            }
        },

        targethtml: {
            build: {
                files: {
                    'index.html': 'src/index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-targethtml');

    grunt.registerTask('build', ['uglify', 'cssmin', 'targethtml']);
};

