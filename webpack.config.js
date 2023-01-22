const webpack = require('webpack');
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
    compress: true,
    port: 5342
  },
};

module.exports = config;
