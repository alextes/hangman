'use strict';
function IllegalMoveError(message) {
  this.name = 'IllegalMoveError';
  this.message = message || 'move did not comply with RuleSet';
  this.stack = (new Error()).stack;
}

IllegalMoveError.prototype = Object.create(Error.prototype);
IllegalMoveError.prototype.constructor = IllegalMoveError;

function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = message || 'resource not found';
  this.stack = (new Error()).stack;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

function GameOverError(message) {
  this.name = 'GameOverError';
  this.message = message || 'Game is finished, can\'t mutate';
  this.stack = (new Error()).stack;
}

GameOverError.prototype = Object.create(Error.prototype);
GameOverError.prototype.constructor = GameOverError;

module.exports = {
  GameOverError,
  IllegalMoveError,
  NotFoundError,
};
