var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var pkg = require('../package.json');

var DEBUG = process.env.NODE_ENV === 'development',
    TEST = process.env.NODE_ENV === 'test',
    PROD = !DEBUG && !TEST;

// Ignore all the moment locales
var plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

// Enable hot reload and keep relative file references
if (DEBUG) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  );
}

if (PROD) {
  plugins.push(
    // Generate CSS files from the LESS files
    new ExtractTextPlugin({
      filename: path.join('assets', 'css', '[name].css'),
      allChunks: true
    }),
    // Minify the JS
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // Suppress errors while compiling
    new webpack.NoEmitOnErrorsPlugin()
  );
}

if (!TEST) {
  var htmlOptions = {
    template: 'index.html',
    hash: true,
    inject: false
  };

  plugins.push(
    // Cache common bundles
    // Split vendor dependencies to their own source
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    // Webpack bootstrapping logic can go into its own chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    // Generate HTML file that pulls in the webpack bundles
    new HtmlWebpackPlugin(htmlOptions)
  );
}

module.exports = plugins;
