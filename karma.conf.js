module.exports = function(config) {
  config.set({
    // autoWatch: true,
    browsers: ['ChromeHeadless'],
    browserConsoleLogOptions: {
      terminal: true,
      level: ''
    },
    // Prevent timeout issues when running the tests
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    captureTimeout: 2000,
    // Allow external scripts to pull in the sources below
    crossOriginAttribute: false,
    // debug: true,
    files: [
      { pattern: 'test-context.js', watched: false }
    ],
    frameworks: ['jasmine'],
    // logLevel: config.LOG_DEBUG,
    port: 9876,
    preprocessors: {
      'test-context.js': ['webpack'],
    },
    reporters: ['progress', 'spec'],
    singleRun: true,
    webpack: require('./webpack/config.test'),
    webpackServer: {
      noInfo: true
    },
  });
};
