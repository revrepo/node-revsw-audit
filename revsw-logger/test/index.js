//var winston = require('winston');

var logger = require('../logger.js')({
  transports: {
    'Console': {},
    'File': {filename: 'test.log'}
  }
});


logger.info('winston - info logged');
logger.debug('winston - error logged');
logger.error('winston - error logged');


logger.log('info', 'foo');
logger.info('winston - exiting now', { seriously: true }, function(err, level, msg, meta) {
  console.log('console - CALLING PROCESS EXIT');
  process.exit(0);
});
