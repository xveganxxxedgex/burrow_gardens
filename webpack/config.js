var path = require('path');
var util = require('util');
var autoprefixer = require('autoprefixer');
var pkg = require('../package.json');

var rules = require('./rules');
var plugins = require('./plugins');

var DEBUG = process.env.NODE_ENV === 'development',
    TEST = process.env.NODE_ENV === 'test';

var entry = {
  'app': ['../src/index.js']
};

// Set up dev server with hot reload for local env
if (DEBUG) {
  entry.app.push(util.format('webpack-dev-server/client?http://%s:%d', pkg.config.devHost, pkg.config.devPort));
  entry.app.push('webpack/hot/only-dev-server');
}

var config = {
  context: path.join(__dirname, '../src'),
  cache: DEBUG,
  target: 'web',
  devtool: DEBUG || TEST ? 'inline-source-map' : false,
  entry: entry,
  output: {
    path: path.resolve(pkg.config.buildDir),
    publicPath: './',
    filename: path.join('assets', 'js', '[name].js'),
    pathinfo: false
  },
  module: {
    rules: rules,
    // noParse: /\.min\.js/ // React v16 min file needs to be compiled, so parse min files for now
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'moment$': 'moment/moment',
    }
  },
  devServer: {
    contentBase: path.resolve(pkg.config.buildDir),
    public: 'localhost:8081',
    hot: DEBUG,
    noInfo: false,
    inline: true,
    stats: { colors: true },
    historyApiFallback: true
  }
};

module.exports = config;
