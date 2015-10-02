module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                background: false
            }
        }
    });
 
    grunt.config("jshint", {
        options: {
            jshintrc: "jshint.json"
        },
        all: [
            "Gruntfile.js",
            "test/karma.conf.js",
            "test/js//**/*.js",
            "src/js/**/*.js"
        ]
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask("initialize", []);
    grunt.registerTask("prepare", []);
    grunt.registerTask("test-unit", ["karma"]);
    grunt.registerTask("test-spec", []);
    grunt.registerTask("test-feature", []);
    grunt.registerTask("test-static", ["jshint"]);
    grunt.registerTask('package', []);
};
