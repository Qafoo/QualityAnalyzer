/* globals module */

module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'test/bind-polyfill.js',
            'assets/bundle.js',
            'test/js/**/*.js'
        ],
        reporters: ['dots', 'junit'],
        junitReporter: {
            outputDir: 'build/log/',
            outputFile: undefined
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-junit-reporter'
        ]
    });
};
