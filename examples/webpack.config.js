var path = require('path');
var webpack = require('webpack');
var JedWebpackPlugin = require('../lib/index');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var locales = ['en-us', 'ru', 'de'];

module.exports = locales.map(function(locale) {
  return {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      path.join(__dirname, 'src', 'index')
    ],
    devtool: 'eval',
    output: {
      filename: locale + '.app.js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
        filename: locale + '.index.html'
      }),
      new webpack.DefinePlugin({
        'process.env.locale': JSON.stringify(locale)
      }),
      new JedWebpackPlugin({
        mo: path.join(__dirname, 'locales', locale + '.mo'),
        defineJedIdentifier: 'jed'
      }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, new RegExp(locale))
    ]
  };
});
