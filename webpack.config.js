module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
      filename: 'docsify-include-template.js',
      path: __dirname + '/dist/'
  },
};
