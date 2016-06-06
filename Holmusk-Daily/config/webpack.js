// config/webpack.js
var path = require('path');
var webpack = require('webpack');

// compile js assets into a single bundle file
module.exports.webpack = {
  options: {
    devtool: 'eval',
    entry: [
      './client/app.js',
    ],
    output: {
      path: './assets/js',
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react']
          }
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader&localIdentName=[name]__[local]___[hash:base64:5]'
        }
      ]
    }
  },

  watchOptions: {
    aggregateTimeout: 300
  }
};