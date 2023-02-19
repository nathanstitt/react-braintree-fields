const webpack = require('webpack');

const config = {
    mode: 'development',
    entry: {
        demo: __dirname + '/demo/index.js',
    },
    output: {
        path: __dirname + '/docs',
        publicPath: '/docs',
        filename: 'demo.js',
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
    ],
    devServer: {
        hot: false,
        port: 2222,
        historyApiFallback: true,
    },
};

// console.log(config)

module.exports = config;
