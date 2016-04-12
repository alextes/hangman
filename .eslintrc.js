module.exports = {
  root:    true,
  env: {
    "mocha": true,
  },
  'extends': 'airbnb',
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  rules:   {
    'semi': 'off',
    'no-unused-vars': ['error', { 'varsIgnorePattern': 'should' }],
    'strict': 'off',
  },
};
