var path = require('path');
var pkg = require('../package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DEBUG = process.env.NODE_ENV === 'development',
    TEST = process.env.NODE_ENV === 'test';

var RULES = {
  // Return URLs for the files
  file: 'file-loader?name=[path][name].[ext]',
  // Transpile ES6 to be browser compatible
  jsx: ['babel-loader']
};

var lessParams = [
  'outputStyle=expanded',
  'includePaths[]=' + path.resolve(__dirname, '../src'),
  'includePaths[]=' + path.resolve(__dirname, '../node_modules')
];

// Keep separate LESS/CSS files when in local env
if (DEBUG || TEST) {
  RULES.less = [
    'style-loader',
    { loader: 'css-loader?sourceMap', options: { sourceMap: true } },
    'postcss-loader',
    'less-loader?' + lessParams.join('&')
  ];

  RULES.css = [
    'style-loader',
    { loader: 'css-loader?sourceMap', options: { sourceMap: true } },
    'postcss-loader'
  ];

} else {
  // Merge all LESS files to a single file
  RULES.less = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      'css-loader',
      'postcss-loader',
      'less-loader?' + lessParams.join('&')
    ]
  });

  // Merge all CSS files to a single file
  RULES.css = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      'css-loader',
      'postcss-loader'
    ]
  });

}

var rules = [
  {
    test: /\.jsx?$/,
    exclude: [/node_modules/],
    loaders: RULES.jsx
  },
  {
    test: /\.css$/,
    loader: RULES.css
  },
  {
    test: /\.jpe?g$|\.gif$|\.png$|\.ico$/,
    loader: RULES.file
  },
  {
    test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: RULES.file
  },
  {
    test: /\.less$/,
    loader: RULES.less
  }
];

module.exports = rules;
