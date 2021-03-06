'use strict';
var webpack = require('webpack');

module.exports = {
    entry: './js/app',
    output: {
        path: __dirname + '/build/js',
        filename: 'app.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            //{ test: /\.jsx?$/, loader: 'jsx-loader?harmony' },
            { test: /\.json$/, loader: 'json-loader' },
        ]
    },

    plugins:[
        // make sure that the files in the generated bundle are included in the
        // same order between builds
        new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.optimize.UglifyJsPlugin()
    ]
};
