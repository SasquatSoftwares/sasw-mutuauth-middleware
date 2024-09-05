const Dotenv = require('dotenv-webpack');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mutuauth-middleware.js'
  },
  target: 'node',
  externals: {
    './settings.json': 'commonjs ./settings.json'
  },
  plugins: [
    new Dotenv(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: './settings.json', to: 'settings.json' },
    //     { from: './license.key', to: 'license.key' },
    //   ],
    // })
  ]
};