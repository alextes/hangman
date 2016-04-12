'use strict';
const debug = require('debug')('hangman:http');
const server = require('./server');

debug('starting server');

// start listening
const port = process.env.PORT || '8080';
server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});
