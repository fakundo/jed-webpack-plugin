# Jed (gettext style i18n) Webpack Plugin

[![npm](https://img.shields.io/npm/v/jed-webpack-plugin.svg?maxAge=1592000)](https://www.npmjs.com/package/jed-webpack-plugin)

Complete i18n solution with webpack and Jed.

## Installation
```
npm install jed-webpack-plugin --save-dev
```

## Usage

webpack.config.js
```js
var locales = ['en-us', 'ru', 'de'];

module.exports = locales.map(function(locale) {
  return {
    entry: path.join(__dirname, 'src', 'index'),
    devtool: 'source-map',
    output: {
      filename: locale + '.app.js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
        filename: locale + '.index.html'
      }),
      new webpack.DefinePlugin({
        'process.env.locale': JSON.stringify(locale)
      }),
      new JedWebpackPlugin({
        mo: path.join(__dirname, 'locales', locale + '.mo'),
        defineJedIdentifier: 'jed'
      }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, new RegExp(locale))
    ]
  };
});
```

entry - index.js
```js
var label = gettext('Hello World');

// Plurals
var n = 10;
var appleLabel1 = ngettext('One apple', '%% apples', n).replace(/%%/, n);
// or
var appleLabel2 = jed.sprintf(ngettext('One apple', '%1$d apples', n), n);
```

## Options

```
mo - translation file path (.mo)
defineJedIdentifier - (optional) name identifier for providing access to jed instance
```

Use Poedit to create translation files from your source code and see examples.
