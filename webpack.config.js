const webpack = require('webpack');
const path = require('path');

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
    node: {
        fs: 'empty',
    },
    devServer: {
        hot: false,
        inline: true,
        port: 2222,
        historyApiFallback: true,
        stats: {
            colors: true,
            profile: true,
            hash: false,
            version: false,
            timings: false,
            assets: true,
            chunks: false,
            modules: false,
            reasons: true,
            children: false,
            source: true,
            errors: true,
            errorDetails: false,
            warnings: true,
            publicPath: false,
        },
    },
};

// console.log(config)

module.exports = config;
