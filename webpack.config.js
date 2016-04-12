const webpack = require('webpack');

module.exports = {
  entry: './client/index.js',
  output: {
    path: './static',
    publicPath: '/static/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime'],
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ];
} else {
  module.exports.devtool = '#source-map';
}
