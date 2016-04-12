'use strict';
let nextId = 0;

function getNextId() {
  return nextId++;
}

module.exports = {
  getNextId,
};
