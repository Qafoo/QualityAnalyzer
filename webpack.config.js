var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {  
    entry: {
        bundle: [
            "bootstrap-sass!./src/bootstrap.config.js",
            "./src/js/app.jsx"
        ],
        tests: [
            "./test/js/path_resolve.js",
            "./test/js/source/tokenizer.js",
            "./test/js/modules/dependencies/model.js"
        ]
    },
    output: {
        path: __dirname + "/assets/",
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

            { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },

            { test: /\.css$/, loader: "style!css" },
            { test: /\.woff2?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf$/, loader: "file-loader" },
            { test: /\.eot$/, loader: "file-loader" },
            { test: /\.svg$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("./bundle.css"),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};
