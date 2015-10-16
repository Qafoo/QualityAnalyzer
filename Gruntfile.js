/* globals module, require */

module.exports = function(grunt) {

    var webpack = require("webpack");
    var webpackConfig = require("./webpack.config.js");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                background: false
            }
        },

        webpack: {
            options: webpackConfig,
            build: {
                devtool: "sourcemap"
            },
            package: {
                plugins: webpackConfig.plugins.concat(
                    new webpack.DefinePlugin({
                        "process.env": {
                            // This has effect on the react lib size
                            "NODE_ENV": JSON.stringify("production")
                        }
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin({minimize: true})
                )
            }
        },

        watch: {
            app: {
                files: ["./src/**/*"],
                tasks: ["webpack:build"],
                options: {
                    debounceDelay: 250,
                    spawn: false,
                    verbose: true
                },
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
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("watcher", ["webpack:build", "watch:app"]);

    /* Tasks to be called by the ant build process */
    grunt.registerTask("initialize", []);
    grunt.registerTask("prepare", ["webpack:build"]);
    grunt.registerTask("test-unit", ["karma"]);
    grunt.registerTask("test-spec", []);
    grunt.registerTask("test-feature", []);
    grunt.registerTask("test-static", ["jshint"]);
    grunt.registerTask('package', ["webpack:package"]);
};
