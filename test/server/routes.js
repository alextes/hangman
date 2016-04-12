'use strict';
const gameManager = require('../../server/game/gameManager');
const request = require('supertest');
const should = require('should');
const server = require('../../server/server');
const sinon = require('sinon');
const mockGameState = require('../mocks/gameState');

describe('Routes', () => {
  describe('#newGame', () => {
    it('should return 200 if starting was successful', done => {
      request(server)
        .get('/newGame')
        .expect(200, (err, res) => {
          res.body.should.have.keys(Object.keys(mockGameState));
          done(err);
        });
    });
  });
  describe('#handleMove', () => {
    before(() => {
      this.id = 0;
      gameManager.createGame(this.id);
    });

    it('should respond 200 if the move was accepted', (done) => {
      sinon.stub(gameManager, 'evaluateMove').returns();
      sinon.stub(gameManager, 'getGameState').returns({});
      const move = { character: 'a', id: this.id };
      request(server)
        .post('/makeGuess')
        .query(move)
        .expect(200, (err, res) => {
          const { message } = res.body;
          message.should.equal('move accepted');
          gameManager.getGameState.restore();
          gameManager.evaluateMove.restore();
          done(err);
        });
    });

    it('should respond 400 if the request is invalid', done => {
      const move = { character: null };
      request(server)
        .post('/makeGuess')
        .query(move)
        .expect(400, done);
    });

    it('should respond 400 if the move was illegal', done => {
      const move = { character: '*' };
      request(server)
        .post('/makeGuess')
        .query(move)
        .expect(400, done);
    });

    it('should respond 500 on an undefined error', done => {
      sinon.stub(gameManager, 'evaluateMove').throws(new Error('forced error'));
      const move = { character: 'a', id: this.id };
      request(server)
        .post('/makeGuess')
        .query(move)
        .expect(500, (err) => {
          done(err);
        });
    });
  });
});
