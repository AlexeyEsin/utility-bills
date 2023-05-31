/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-css-variables'),
    require('postcss-url')({ url: 'inline' }),
  ],
};
