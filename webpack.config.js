/* global __dirname */
var path = require('path'),
    libPath = path.join(__dirname, 'source'),
    wwwPath = path.join(__dirname, 'www'),
    pkg = require('./package.json'),
    webpack = require("webpack"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: path.join(libPath, 'app.js'),
    output: {
        path: wwwPath,
        filename: 'bundle-[hash:6].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /[\/]lodash\.js$/,
            loader: 'expose?_'
        }, {
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            loader: "babel"
        }, {
            test: /\.json$/,
            loader: "json"
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'file?name=[path][name].[ext]?[hash]'
            // loader: 'url?limit=25000'
        }, {
            test: /\.css$/,
            loader: "style!css?sourceMap"
        }, {
            test: /\.scss$/,
            // loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader?sourceMap")
            // loader: "style!css?sourceMap!sass?sourceMap" // Stops image urls working?
            loader: "style!css!sass" // image urls work without sourcemaps
        }, {
            test: /\.(woff|eot|ttf|svg)$/,
            // loader: 'file?name=img/[name].[ext]'
            loader: 'url?limit=25000'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.scss', '.html'],
        root: [
            libPath,
            path.join(__dirname, 'node_modules')
        ],
        moduleDirectories: [
            'node_modules'
        ],
        fallback: [
            path.join(libPath, 'assets')
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            pkg: pkg,
            template: path.join(libPath, 'index.html')
        })
    ]
};
