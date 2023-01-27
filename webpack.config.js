const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
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
  plugins: [new ESLintPlugin({fix: true})],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
