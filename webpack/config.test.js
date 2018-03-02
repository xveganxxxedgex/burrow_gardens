var rewirePlugin = require('rewire-webpack');
var RewirePlugin = new rewirePlugin();

var config = require('./config');

delete config.context;
delete config.entry;
delete config.output;
delete config.devServer;

config.watch = true;

module.exports = config;
