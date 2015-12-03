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
                            "NODE_ENV": JSON.stringify("production")
                        }
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin({minimize: true})
                )
            }
        },

        eslint: {
            options: {
                configFile: 'src/eslint.config.json'
            },
            target: ['src/**/*.js', 'src/**/*.jsx', 'test/**/*.js']
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
 
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask("watcher", ["webpack:build", "watch:app"]);

    /* Tasks to be called by the ant build process */
    grunt.registerTask("initialize", []);
    grunt.registerTask("prepare", ["webpack:build"]);
    grunt.registerTask("test-unit", ["karma"]);
    grunt.registerTask("test-spec", []);
    grunt.registerTask("test-feature", []);
    grunt.registerTask("test-static", ["eslint"]);
    grunt.registerTask('package', ["webpack:package"]);
};
