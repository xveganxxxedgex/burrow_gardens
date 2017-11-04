var util = require('util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var pkg = require('./package.json');

var port = pkg.config.devPort,
    host = pkg.config.devHost;

var configPath = process.argv[2] || './webpack/config';
var config = require(configPath);

var server = new WebpackDevServer(webpack(config), config.devServer);

server.listen(port, host, function (err) {
  if (err) return console.log(err);
  console.log('Listening at http://%s:%d', host, port);
});
