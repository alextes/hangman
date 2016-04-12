'use strict';
const { IllegalMoveError } = require('./util/customError');
const debug = require('debug')('hangman:server');
const gameManager = require('./game/gameManager');
const gameValidation = require('./validations/gameValidation');
const sessionId = require('./util/sessionId');

// TODO(improvement): use custom error objects to promote loose coupling
// this would result in routes only knowing about the game manager, not the game
// TODO(improvement): deleting games should require a secret token

/**
 * Handle start new game request
 * @param req
 * @param res
 */
function startNewGame(req, res) {
  const id = sessionId.getNextId();
  const resObj = gameManager.createGame(id);
  resObj.sessionId = id;
  res.send(200, resObj);
}

/**
 * Handle make move request
 * @param req
 * @param {string} req.query.id - id of the session the user is in
 * @param {string} req.query.character - character the user guessed
 * @param res
 * @returns {*}
 */
function handleMove(req, res) {
  // validate request
  const validation = gameValidation.validateGuess(req.query);
  if (validation.error) {
    debug('request was invalid, validation error:', validation.error);
    return res.send(400, new Error('request did not validate'));
  }

  // see if the move is legal
  const id = req.query.id;
  const guess = { character: req.query.character };

  // make the move
  try {
    gameManager.evaluateMove(id, guess);
  } catch (error) {
    switch (error.constructor) {
      case IllegalMoveError:
        return res.send(400, error);
      case GameOverError:
        return res.send(400);
      default:
        debug('failed to make move for unexpected reason, error:', error);
        return res.send(500);
    }
  }

  // everything went well, send update response
  const resObj = gameManager.getGameState(id);
  resObj.message = 'move accepted';
  return res.send(200, resObj);
}

/**
 * Handle delete request
 * @param req
 * @param {number} req.query.id - id of the session that should be deleted
 * @param res
 * @returns {*}
 */
function deleteGame(req, res) {
  // validate request
  const validation = gameValidation.validateDelete(req.query);
  if (validation.error) {
    debug('request was invalid, validation error:', validation.error);
    return res.send(400, new Error('request did not validate'));
  }

  gameManager.deleteGame(req.query.id);
  return res.send(200);
}

module.exports = (server) => {
  server.get('/startNewGame', startNewGame);
  server.post('/makeGuess', handleMove);
  server.del('/deleteGame', deleteGame);
};
