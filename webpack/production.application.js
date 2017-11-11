const webpack = require('webpack');
const Uglify = require('uglifyjs-webpack-plugin');
const config = require('../webpack');

module.exports = {
    ...config,
    entry: ['babel-polyfill', './src/js/bootstrap.js'],
    output: {
        path: __dirname + '/../public/assets/js',
        filename: 'application.js',
        libraryTarget: 'var',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new Uglify({
            uglifyOptions: {
                ecma: 8
            }
        })
    ]
};
