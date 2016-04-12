/**
 * Returns a random element from an array
 * @param {*[]} items - Array of items to select from
 * @returns {*}
 */
function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

module.exports = {
  pickRandomItem,
};
