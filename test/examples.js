var chai = require('chai');
var assert = chai.assert;

describe('examples', function() {

  it('en-us', function() {
    require('../examples/dist/en-us.app.js');
    assert.equal(global.jed.gettext('Hello World'), 'Hello World');
  });

  it('ru', function() {
    require('../examples/dist/ru.app.js');
    assert.equal(global.jed.ngettext('One apple', '%% apples', 1), 'Одно яблоко');
  });

  it('de', function() {
    require('../examples/dist/de.app.js');
    assert.equal(global.jed.gettext('Hello World'), 'Hallo Welt');
  });

});
