/* eslint-disable no-console */
'use strict';
const morgan = require('morgan');
const debug = require('debug')('hangman:server');
const path = require('path');
const restify = require('restify');
const routes = require('./routes');

// create a server
const server = restify.createServer({
  name: 'executioner',
});

// set up a request logger
const minStatus = process.env.NODE_ENV === 'production' ? 400 : 200;
debug(`not reporting any requests with a status under ${minStatus}`);
const logger = morgan('dev', {
  skip: (req, res) => res.statusCode < minStatus,
});
server.use(logger);

// reply 406 to requests we don't understand
server.use(restify.acceptParser(server.acceptable));
// parse query strings
server.use(restify.queryParser());

// Don't serve publicly but make exceptions for index.html and our js bundle
server.get(/\/index.html/, restify.serveStatic({
  directory: path.join(__dirname, '../static'),
}));
server.get(/\/bundle.js/, restify.serveStatic({
  directory: path.join(__dirname, '../static'),
}));

routes(server);

if (!module.parent) {
  server.listen(8888, () => {
    console.log('%s listening at %s', server.name, server.url);
  });
}

module.exports = server;
