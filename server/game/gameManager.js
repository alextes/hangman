/* eslint-disable no-unused-vars */
'use strict';
const { GameOverError, NotFoundError } = require('../util/customError');
const Game = require('./game');
const config = require('../config/gameConfig');
const debug = require('debug')('hangman:gameManager');
const guessables = require('../config/guessables');
const { remove } = require('lodash');
const rules = require('../config/ruleSet');

const runningGames = [];

/**
 * Creates a new game and saves it in memory
 * @param {GameId} id
 * @returns {{movesLeft: number, secretWordLength: number}}
 */
function createGame(id) {
  const game = new Game(id, rules, config, guessables);
  runningGames.push(game);
  return {
    movesLeft: game.movesLeft,
    secretWordLength: game.secretWordLength,
  };
}

/**
 * Deletes a game from the running list
 * @param {GameId} id
 */
function deleteGame(id) {
  const removedGames = remove(runningGames, (game) => game.id === id);
  if (removedGames.length === 0) {
    throw new NotFoundError(`could not find game with id ${id} to delete`);
  }
}

/**
 * Returns a running game by id
 * @param {GameId} id
 * @returns {Game}
 */
function getGame(id) {
  const matchingGame = runningGames.find((game) => game.id === id);
  if (!matchingGame) {
    debug(`could not find running game with id: ${id}`);
    throw new NotFoundError;
  }
  return matchingGame;
}

/**
 * Returns if the player is out of moves
 * @param {GameId} id
 * @returns {Boolean}
 */
function isGameLost(id) {
  const game = getGame(id);
  return game.isLost;
}

/**
 * Returns if the player is out of moves, or solved the game
 * @param {GameId} id
 * @returns {Boolean}
 */
function isGameOver(id) {
  return isGameLost(id) || isGameWon(id);
}

/**
 * Returns if the whole word is solved and the game thus won
 * @param {GameId} id
 * @returns {Boolean}
 */
function isGameWon(id) {
  const game = getGame(id);
  return game.isWon;
}

/**
 * Returns the relevant bit of state for the user
 * @param {GameId} id
 * @returns {{movesLeft: number, guessedCharacters: string, solvedWord: Array}}
 */
function getGameState(id) {
  const game = getGame(id);
  return {
    guessesLeft: game.movesLeft,
    guessedCharacters: game.guessedCharacters,
    solvedWord: game.solvedWord,
  };
}

/**
 * Passes a guess to a running game and handles the result
 * @param {GameId} id
 * @param {Guess} guess - guess the user wants to make
 */
function evaluateMove(id, guess) {
  if (isGameOver(id)) {
    throw new GameOverError();
  }
  const game = getGame(id);
  game.evaluateMove(guess);
}

module.exports = {
  createGame,
  deleteGame,
  getGame,
  getGameState,
  evaluateMove,
};

/* -- Game Manager related object definitions -- */

/**
 * identifier for a running game
 * @typedef {number} GameId
 */

/**
 * An object containing all relevant information about a guess the Game needs
 * @typedef {Object} Guess
 * @param {string} Guess.character - the character guessed by the user
 */

/**
 * @typedef {Object} RuleSet - Object holding the current set of rules
 * @property {boolean} limitMoveCharSet -
 * @property {boolean} limitMoveCount -
 * @property {boolean} sameLetterMoveCounts -
 */

/**
 * @typedef {Object} GameConfig - Object holding values to do with
 *   configuring the game
 * @property {string} legalCharacterRegExp - regular expression detailing
 *   a legal character set
 * @property {number} maxMoves - max number of moves a user is allowed to make
 */
