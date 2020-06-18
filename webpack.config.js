const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,
    target: 'web',

    entry: {
        client: path.resolve('src', 'client', 'index.ts'),
    },

    output: {
        path: path.resolve('dist'),
        filename: 'assets/[name].bundle.js',
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
            {
                test: /\.s?css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'assets',
                    name: '[name].[ext]',
                },
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },

    optimization: {
        minimize: isProduction,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
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
        new MiniCssExtractPlugin({
            filename: 'assets/[name].bundle.css',
            chunkFilename: 'assets/[id].bundle.css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src', 'client', 'index.html'),
            chunks: ['client'],
            minify: true,
            filename: 'index.html',
        }),
    ],

    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve('dist'),
        host: '0.0.0.0',
        port: 7000,
        proxy: {
            '/api/ws': {
                target: 'ws://localhost:7001',
                ws: true,
            },
            '/api/*': {
                target: 'http://localhost:7001',
            },
        },
    },

    stats: 'minimal',
};
