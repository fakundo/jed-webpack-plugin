var fs = require('fs');
var jedGettextParser = require('jed-gettext-parser');
var ConstDependency = require('webpack/lib/dependencies/ConstDependency');
var PrefetchDependency = require('webpack/lib/dependencies/PrefetchDependency');
var NullFactory = require('webpack/lib/NullFactory');

var jedFunctions = ['gettext', 'dgettext', 'dcgettext', 'ngettext', 'dngettext', 'dcngettext', 'pgettext', 'dpgettext', 'npgettext', 'dnpgettext', 'dcnpgettext'];

var defaultLocaleData = {"messages": {"": {domain: "messages", "lang": "en", "plural_forms" : "nplurals=2; plural=(n != 1);"}}};

function JedWebpackPlugin(options) {
  this.mo = options.mo || {};
  this.defaultLocaleData = options.defaultLocaleData || defaultLocaleData;
  this.defineJedIdentifier = options.defineJedIdentifier;
}

JedWebpackPlugin.prototype.apply = function(compiler) {

  var that = this;
  var localeData = extractLocaleDataFromMo(this.mo, this.defaultLocaleData);
  var jedModule;

  // Prefetch jed module
  compiler.plugin('make', function(compilation, callback) {
    var dep = new PrefetchDependency('jed');
    compilation.prefetch(this.context || compiler.context, dep, function(err, module) {
      if (!err) jedModule = module;
      callback(err);
    });
  });

  compiler.plugin('compilation', function(compilation, data) {
    compilation.dependencyFactories.set(PrefetchDependency, data.normalModuleFactory);
    compilation.dependencyFactories.set(ConstDependency, new NullFactory());
    compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());

    // Extend mainTemplate
    compilation.mainTemplate.plugin('require-extensions', function(source, chunk, hash) {

      if (jedModule && jedModule.id) {

        // Add module to chunk
        chunk.addModule(jedModule);

        return this.asString([
          source,
          '',
          '// Jed Webpack Plugin',
          'var Jed = ' + this.requireFn + '(' + jedModule.id + ')' + ';',
          this.requireFn + '.jed = new Jed({ locale_data: ' + JSON.stringify(localeData) + ' });'
        ]);
      }
      else {
        return source;
      }
    });

    data.normalModuleFactory.plugin('parser', function(parser, options) {

      // Replace defineJedIdentifier
      if (that.defineJedIdentifier) {
        parser.plugin('expression ' + that.defineJedIdentifier, function(expr) {
          var compilation = this.state.compilation;
          var mainTemplate = compilation.mainTemplate;

          var replace = mainTemplate.requireFn + '.jed';
          var dep = new ConstDependency(replace, expr.range);

          dep.loc = expr.loc;
          this.state.current.addDependency(dep);
          return true;
        });
      }

      // Replace Jed function calls
      jedFunctions.forEach(function(func) {
        parser.plugin('call ' + func, function(expr) {
          var args = expr.arguments.map(function (arg) {
            return JSON.stringify(arg.value);
          });

          var compilation = this.state.compilation;
          var mainTemplate = compilation.mainTemplate;

          var replace = mainTemplate.requireFn + '.jed.' + func + '(' + args.join(',') + ')';
          var dep = new ConstDependency(replace, expr.range);

          dep.loc = expr.loc;
          this.state.current.addDependency(dep);
          return true;
        });
      });
    });
  });
};

// String to array buffer
function toArrayBuffer(data) {
  var ab = new ArrayBuffer(data.length);
  var view = new Uint8Array(ab);
  var i = -1;

  while(i++ < data.length) {
    view[i] = data[i]
  }
  return ab;
}

// Parse locale data from .mo file
function extractLocaleDataFromMo(mo, defaultLocaleData) {
  try {
    var contents = fs.readFileSync(mo);
  }
  catch(e) {
    return defaultLocaleData;
  }
  return jedGettextParser.mo.parse(toArrayBuffer(contents));
}

module.exports = JedWebpackPlugin;
