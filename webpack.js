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
    node: {
        fs: "empty",
        net: "empty"
    }
};
