module.exports = {
    target: 'node',
    entry: {
        server: ['babel-polyfill', './src/server/index.js']
    },
    output: {
        path: __dirname + '/public',
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/i
            }
        ]
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
