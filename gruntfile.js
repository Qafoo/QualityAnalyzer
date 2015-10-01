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
 
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('default', ['karma']);
};
