const config = require('../webpack');

module.exports = {
    ...config,
    entry: ['babel-polyfill', './src/js/bootstrap.js'],
    output: {
        path: __dirname + '/../public/assets/js',
        filename: 'application.js',
        libraryTarget: 'var',
    }
};
