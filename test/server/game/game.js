/* eslint-disable func-names */
'use strict';
const config = require('../../../server/config/gameConfig');
const Game = require('../../../server/game/game');
const guessables = require('../../../server/config/guessables');
const { IllegalMoveError } = require('../../../server/util/customError');
const { clone } = require('lodash');
const ruleSet = require('../../../server/config/ruleSet');
const should = require('should');
const sinon = require('sinon');

describe('Game', () => {
  describe('#isLegalMove', () => {
    it('should reject illegal count moves', function () {
      const mockConfig = clone(config);
      mockConfig.maxMoves = 0;
      this.game = new Game(195, ruleSet, mockConfig, guessables);
      const guess = { character: '3' };
      this.game.isLegalMove(guess).should.be.false();
    });
    it('should reject illegal char moves', function () {
      const mockConfig = clone(config);
      mockConfig.legalCharacterRegExp = '[a-z]|\d';
      this.game = new Game(195, ruleSet, mockConfig, guessables);
      const guess = { character: '#' };
      this.game.isLegalMove(guess).should.be.false();
    });
    it('should reject same letter moves if they count', function () {
      const mockRuleSet = clone(ruleSet);
      mockRuleSet.sameLetterMoveCounts = false;
      this.game = new Game(195, mockRuleSet, config, guessables);
      const guess = { character: '3' };
      this.game.evaluateMove(guess);
      // at this point the previous guess should be saved
      // so the next check should fail
      this.game.isLegalMove(guess).should.be.false();
    });
  });
  describe('#evaluateMove', () => {
    it('should throw on illegal move', () => {
      this.game = new Game(195, ruleSet, config, guessables);
      sinon.stub(this.game, 'isLegalMove').returns(false);
      const guess = { character: 'a' };
      try {
        this.game.evaluateMove(guess);
      } catch (error) {
        if (!error) {
          throw new Error('expected error, got undefined');
        } else {
          error.constructor.should.equal(IllegalMoveError);
        }
      }
    });
  });
  describe('#matchCharacter', () => {
    it('should match characters in the secret word', () => {
      this.game = new Game(195, ruleSet, config, ['3dhu3bs']);
      this.game.matchCharacter('3').should.eql([0, 4]);
    });
  });
  describe('#updateGame', () => {
    it('should increase the number of move made by one', () => {
      this.game = new Game(195, ruleSet, config, guessables);
      this.game.updateGameState('a', []);
      this.game.numberOfMovesMade.should.equal(1);
    });
    it('should update the solved word', () => {
      this.game = new Game(195, ruleSet, config, ['3dhu3bs']);
      const indices = this.game.matchCharacter('3');
      this.game.updateGameState('3', indices);
      const expectedSolvedWord = [];
      for (let i = 0; i < this.game.secretWord.length; i++) {
        expectedSolvedWord.push(null);
      }
      expectedSolvedWord[0] = '3';
      expectedSolvedWord[4] = '3';
      this.game.solvedWord.should.eql(expectedSolvedWord);
    });
  });
  describe('gameEnd', () => {
    it('should say the game is lost if lost', () => {
      const mockConfig = clone(config);
      mockConfig.maxMoves = 0;
      this.game = new Game(195, ruleSet, mockConfig, guessables);
      this.game.isLost.should.be.true();
    });
  });
});
