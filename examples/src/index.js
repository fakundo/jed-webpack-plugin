// Test in browser
if (typeof window !== 'undefined') {
  document.write(gettext('Hello World'));
  document.write('<br />');

  document.write(ngettext('One apple', '%% apples', 1).replace(/%%/, 1));
  document.write('<br />');

  document.write(ngettext('One apple', '%% apples', 2).replace(/%%/, 2));
  document.write('<br />');

  document.write(ngettext('One apple', '%% apples', 10).replace(/%%/, 10));
  document.write('<br />');

  var moment = require('moment');
  moment.locale(process.env.locale);
  document.write(moment().format('LLL'));
}

// Export jed for mocha tests
if (typeof global !== 'undefined') {
  global.jed = jed;
}
