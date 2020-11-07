const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,
    target: 'node',

    entry: path.resolve('src', 'server', 'index.ts'),

    output: {
        path: path.resolve('dist', 'server'),
        filename: 'index.js',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    'ts-loader',
                ],
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.mjs' ],
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.EnvironmentPlugin({
            DEV: JSON.stringify(!isProduction),
            VERSION: process.env.npm_package_version,
        }),
    ],

    devtool: 'source-map',
    stats: 'minimal',
};
