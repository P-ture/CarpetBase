const webpack = require('../webpack');

module.exports = {
    ...webpack,
    entry: ['babel-polyfill', './src/js/bootstrap.js'],
    output: {
        path: __dirname + '/../public/assets/js',
        filename: 'application.js',
        libraryTarget: 'var',
    }
};
