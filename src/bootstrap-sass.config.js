var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    bootstrapCustomizations: "./src/bootstrap-sass.config.scss",
    mainSass: "./src/css/app.scss",
    verbose: true,
    debug: false,
    styleLoader: ExtractTextPlugin.extract("style-loader", "css-loader!sass?outputStyle=expanded"),
    scripts: {
        'transition': true
    },
    styles: {
        "mixins": true,
 
        "normalize": true,
        "print": true,
 
        "scaffolding": true,
        "type": true
    }
};
