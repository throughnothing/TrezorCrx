'use strict';
var webpack = require('webpack');

module.exports = {
    entry: './js/app',
    output: {
        path: __dirname + '/build/js',
        filename: 'app.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            //{ test: /\.jsx?$/, loader: 'jsx-loader?harmony' },
        ]
    },

    plugins:[
        // make sure that the files in the generated bundle are included in the
        // same order between builds
        new webpack.optimize.OccurenceOrderPlugin(),
    ]
};
