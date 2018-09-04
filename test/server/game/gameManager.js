/* eslint-disable func-names */
'use strict';
const { NotFoundError } = require('../../../server/util/customError');
const gameManager = require('../../../server/game/gameManager');
const { GameOverError } = require('../../../server/util/customError');
const should = require('should');

describe('GameManager', () => {
  describe('#createGame', () => {
    before(() => {
      this.id = 195;
    });
    after(() => {
      gameManager.deleteGame(this.id);
    });
    it('should return a an initial game state', () => {
      const initialGameState = gameManager.createGame(this.id);
      initialGameState.should.have.keys('movesLeft', 'secretWordLength');
    });
  });

  describe('#evaluateMove', () => {
    it.skip('should throw a GameOverError if the game is done', () => {
      gameManager.createGame(196);
      const game = gameManager.getGame(196);
      game.movesLeft = 0;
      try {
        gameManager.evaluateMove(196, { character: 'a' });
      } catch (error) {
        if (!error) {
          throw new Error('expected error!');
        }
        error.constructor.should.equal(GameOverError);
      }
    });
  });

  describe('#getGame', () => {
    before(() => {
      this.id = 195;
    });
    after(() => {
      gameManager.deleteGame(this.id);
    });
    it('should return a game by it\s id', () => {
      gameManager.createGame(this.id);
      const retrievedGame = gameManager.getGame(this.id);
      retrievedGame.id.should.equal(this.id);
    });
  });

  describe('#deleteGame', () => {
    before(() => {
      this.id = 195;
    });
    after(() => {
      gameManager.deleteGame(this.id);
    });
    it('should delete an existing game if requested', () => {
      gameManager.createGame(this.id);
      gameManager.deleteGame(this.id);
    });
    it('should throw a NotFoundError if the game doesn\'t exist', () => {
      gameManager.createGame(this.id);
      try {
        gameManager.deleteGame(951);
      } catch (error) {
        error.constructor.should.equal(NotFoundError);
      }
    });
  });
});
