var through = require('through');
var jade = require('jade');

module.exports = function(file, options) {
  if (!/\.jade$/.test(file)) return through();
  if(!options) options = {}

  var contents = '';

  function write(buffer) {
    contents += buffer;
  }

  function end() {
    var that = this;
    options.filename = file
    jade.render(contents, options, function(err, html) {
      if (err) return that.emit('error', err);
      that.queue('module.exports = ' + JSON.stringify(html) + ';\n');
      that.queue(null);
    });
  }

  return through(write, end);
};
