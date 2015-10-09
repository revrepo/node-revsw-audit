var winston = require('winston');

module.exports = function setup(options) {

  var transports = [];
  var transportName;

  for (transportName in options.transports || {}) {

    if (!options.transports.hasOwnProperty(transportName) || '_merge' === transportName) {
      continue;
    }

    if (!winston.transports[transportName]) {
      console.warn('WARNING: winston logging configuration specifies undefined transport `%s` which will be ignored', transportName);
      continue;
    }

    transports.push(new winston.transports[transportName](options.transports[transportName]));
  }


  var logger = new (winston.Logger)({
    transports: transports
  });

    return logger;
};
