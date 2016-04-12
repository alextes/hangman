'use strict';
const { IllegalMoveError } = require('../util/customError');
const debug = require('debug')('hangman:game');
const { pickRandomItem } = require('../util/util');

// TODO(improvement): make validator class to simply call validate(guess) on
// this would simplify the way rules are handled

/**
 * Game class containing all our game session related state and logic
 * @class
 */
class Game {
  /**
   * @constructor
   * @param {number} id - id of the created game object
   * @param {RuleSet} ruleSet - set of ruleSet the game verifies against
   * @param {GameConfig} config - file containing game configuration
   * @param {string[]} guessables - list of guessable words,
   *   defaults to config/guessables
   */
  constructor(id, ruleSet, config, guessables) {
    this.config = config;
    this.id = id;
    // if there were guessables passed, use those, otherwise use the defaults
    this.guessables = guessables;
    this.guessedCharacters = String('');
    this.numberOfMovesMade = 0;
    this.ruleSet = ruleSet;
    this.secretWord = pickRandomItem(this.guessables);
    this.solvedWord = [];
    // TODO(improve): handle solved word better
    for (let i = 0; i < this.secretWord.length; i++) {
      this.solvedWord.push(null);
    }
  }

  get solvedCount() {
    let solvedCount = 0;
    for (let i = 0; i < this.secretWord.length; i++) {
      if (this.secretWord[i] === this.solvedWord[i]) {
        solvedCount += 1;
      }
    }
    return solvedCount;
  }

  get isLost() {
    return this.movesLeft === 0
  }

  get isWon() {
    return this.solvedCount === this.secretWordLength;
  }
  /**
   * Returns how many guesses are left
   * @returns {number} - the number of guesses that's left
   */
  get movesLeft() {
    return this.config.maxMoves - this.numberOfMovesMade;
  }

  /**
   * Returns the length of the secret word
   * @returns {number}
   */
  get secretWordLength() {
    return this.secretWord.length;
  }

  /**
   * Checks if the character is within the character set defined in the ruleSet
   * @param {string} character - character to check the allowed character-set
   *   against
   * @returns {boolean}
   */
  isLegalFormat(character) {
    // TODO: check if regexp is parsed correctly from ruleSet
    const regExp = new RegExp(this.config.legalCharacterRegExp);
    return regExp.test(character);
  }

  /**
   * Takes a guess object and validates it against our ruleSet
   * @param {Guess} guess - a guess made by the user
   * @returns {boolean}
   */
  isLegalMove(guess) {
    let validity = true;
    if (this.ruleSet.limitMoveCount) {
      if (!(this.numberOfMovesMade < this.config.maxMoves)) {
        debug(`tried to guess when ${this.numberOfMovesMade} were made
          and only ${this.config.maxMoves} are allowed`);
        validity = false;
      }
    }
    if (this.ruleSet.limitMoveCharSet) {
      if (!this.isLegalFormat(guess.character)) {
        debug(`guess has an illegal format. Guess was ${guess.character},
          allowed format is ${this.config.legalCharacterRegExp}`);
        validity = false;
      }
    }
    if (!this.ruleSet.sameLetterMoveCounts) {
      if (this.guessedCharacters.indexOf(guess.character) !== -1
        && !this.ruleSet.sameLetterGuessCounts) {
        // if a same letter guess does not count we simply tell the user
        // the guess was bad
        debug(`character was already guessed. Guess was ${guess.character}`);
        validity = false;
      }
    }
    return validity;
  }

  /**
   * Tries to make the move and returns if the move was legal
   * @param {Guess} guess - the guess the user wanted to make
   * @param {string} guess.character - character the user guessed
   * @returns {boolean} success
   */
  evaluateMove(guess) {
    if (!this.isLegalMove(guess)) {
      // guess does not comply with the ruleSet
      throw new IllegalMoveError();
    }
    // guess is valid, create an move object, move the game state and return
    const matchedIndices = this.matchCharacter(guess.character);
    this.updateGameState(guess.character, matchedIndices);
  }

  /**
   * Returns the indices of the passed character in the secret word
   * @param {string} character - character to return indices for
   * @returns {number[]} - indices of the character within the secret word
   */
  matchCharacter(character) {
    const indices = [];
    for (let i = 0; i < this.secretWord.length; i++) {
      // TODO: check if char is a string
      if (this.secretWord[i] === character) {
        indices.push(i);
      }
    }
    return indices;
  }

  /**
   * Updates the state, moving the game forward
   * @param {string} character
   * @param {number[]} indices
   */
  updateGameState(character, indices) {
    // spend one move if no matches were made
    if (indices.length === 0) {
      this.numberOfMovesMade += 1;
    }

    // update the solved word
    for (const index of indices) {
      this.solvedWord[index] = character;
    }

    // save guessed string if we haven't yet
    if (this.guessedCharacters.indexOf(character) === -1) {
      this.guessedCharacters = this.guessedCharacters.concat(character);
    }
  }
}

module.exports = Game;

/* -- Definitions of Game related objects -- */

/**
 * An object describing a state changing move
 * @typedef {Object} move
 * @property {boolean} move.isLegal - Indicates whether a guess conformed to the
 *   rules
 * @property {string} move.character - The character that was guessed
 */
