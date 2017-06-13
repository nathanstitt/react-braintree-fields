const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        demo: __dirname + '/demo.jsx',
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
                options: {
                    plugins: [
                        'babel-plugin-transform-class-properties',
                        'babel-plugin-transform-function-bind',
                        'babel-plugin-transform-react-jsx',
                    ].map(require.resolve),
                    presets: [
                        [require.resolve('babel-preset-es2015'), { modules: false }],
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1'),
                    ],
                },
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
