var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {  
    entry: [
        "bootstrap-sass!./src/bootstrap-sass.config.js",
        "./src/js/app.jsx"
    ],
    output: {
        path: __dirname + "/assets/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

            { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },

            { test: /\.css$/, loader: "style!css" },
            { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
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
