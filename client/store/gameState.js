import Promise from 'bluebird';
import { pick } from 'lodash';
import request from 'superagent';
import routes from '../routes';

/**
 * @param {string} character
 * @returns {Promise}
 */
export function guess(character) {
  if (!this.sessionId) {
    throw new Error('Can\'t make requests without a session id');
  }
  return Promise.fromCallback(callback => {
    request
      .get(routes.makeMove)
      .query({
        sessionId: this.sessionId,
        character,
      })
      .end(callback);
  })
    .then((err, res) => {
      if (err) {
        throw err;
      }
      const { movesLeft, solvedWord, message, guessedCharacters } = res.body;
      if (message) {
        this.message = message;
        return;
      }
      this.movesLeft = movesLeft;
      this.solvedWord = solvedWord;
      this.guessedCharacters = guessedCharacters;
    });
}

/**
 * @returns {Promise}
 */
export function startNewGame() {
  return Promise.fromCallback(callback => {
    request.get(routes.newGame).end(callback);
  })
    .then((err, res) => {
      if (err) {
        throw err;
      }
      const { movesLeft, solvedWord, sessionId } = res.body;
      this.movesLeft = movesLeft;
      this.solvedWord = solvedWord;
      this.sessionId = sessionId;
      this.message = '';
      this.guessedCharacters = '';
    });
}

export function getCurrentGameState() {
  return pick(this, [
    'guessedCharacters',
    'movesLeft',
    'message',
    'solvedWord', 'sessionId']);
}
