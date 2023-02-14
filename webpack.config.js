const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/bundle.js'
  },
  devServer: {
    static: {
        directory: path.join(__dirname, 'public')
    },
    client: {
      overlay: false,
    },
    compress: true,
    port: 5342
  },
  plugins: [
    new ESLintPlugin({fix: true}),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
      chunkFilename: "./css/[id].css",
    }),
    new HtmlWebpackPlugin({
      title: 'Game',
      // Load a custom template (lodash by default)
      template: './public/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i, // test for .sass or .scss extension
        use: [
          // Load style-loader or mini-css-extract-plugin-loader
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  }
};

module.exports = config;
