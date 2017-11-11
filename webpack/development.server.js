const config = require('../webpack');

module.exports = {
    ...config,
    target: 'node',
    entry: ['babel-polyfill', './src/server/index.js'],
    output: {
        path: __dirname + '/../public',
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    externals: {
        knex: 'commonjs knex',
        argon2: 'argon2'
    },
    node: {
        fs: "empty",
        net: "empty"
    }
};
