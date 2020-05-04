const path = require('path');

module.exports = (env, options) => {
  const config = {

    entry: {
      'bpf.video': ['@babel/polyfill', './src/bpf.video.js'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    }
  };

  return config;
};
