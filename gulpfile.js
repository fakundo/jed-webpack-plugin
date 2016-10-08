var gulp = require('gulp');
var gutil = require('gutil');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var statsConfig = {
  colors: true,
  chunks: false,
  modules: false,
  hash: false,
  version: false
};

gulp.task('examples:dist', function(cb) {
  var webpackConfig = require('./examples/webpack.config');
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString(statsConfig));
    cb();
  });
});

gulp.task('examples:dev', function (cb) {
  var webpackConfig = require('./examples/webpack.config')[1];
  webpackConfig.devtool = 'eval';
  webpackConfig.debug = true;

  var htmlWebpackPlugin = webpackConfig.plugins.find(function(plugin) {
    return plugin instanceof HtmlWebpackPlugin;
  });

  htmlWebpackPlugin.options.filename = 'index.html';

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    stats: statsConfig
  }).listen(8080, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});
