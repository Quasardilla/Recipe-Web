const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    // Specifying the mode
    mode: 'development',
    // Entry point to our application
    entry: './frontend/main.js',
    // Path to the Output
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    // resolve: {
    //     conditionNames: ['svelte'],
    // },
    //Specifying the Loaders for Babel, Svelte and CSS
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                type: 'asset/resource',
            },
        ]
    },
    
    plugins: [
        // Creates index.html file in the build folder
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template/index.html'),
        }),
        // This grabs the CSS and places it in a single file
        new MiniCssExtractPlugin(),
        // Manages the environment variables in the .env file.
        new Dotenv(),
    ],
    // Configuring Webpack Dev Server and Set Hot Reloading to true
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        hot: true
    },
    // externals: {   
    //     argon2: 'argon2',
        
    // },
};