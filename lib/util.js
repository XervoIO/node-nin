var fs = require('fs'),
    util = require('util');

util.merge = function(o1, o2) {
  var obj = {};

  for(var k in o2) {
    obj[k] = o2[k];
  }

  for(var k in o1) {
    if(o1[k] instanceof Array && o2[k] instanceof Array) {
      obj[k] = o1[k].concat(o2[k]);
    } else if(typeof o1[k] === 'object' && typeof o2[k] === 'object') {
      obj[k] = util.merge(o1[k], o2[k]);
    } else if(!o2.hasOwnProperty(k)) {
      obj[k] = o1[k];
    } else {
      obj[k] = o2[k];
    }
  }

  return obj;
};

util.readDir = function(base, dir, contents) {
  contents = contents || {};

  var listing = fs.readdirSync(dir),
      entry = null,
      stats = null;

  for(var i = 0; i < listing.length; i++) {
    entry = dir + '/' + listing[i];
    stats = fs.statSync(entry);

    if(stats.isFile()) {
      contents[entry.replace(base + '/', '')] = fs.readFileSync(entry, 'utf8');
    } else if(stats.isDirectory()) {
      util.readDir(base, entry, contents);
    }
  }

  return contents;
};

util.writeFile = function(file, content) {
  var split = file.split('/');

  if(split.length === 1) {
    fs.writeFileSync(split[0], content);
  } else {
    var cwd = split[0];
    for(var p = 0; p < split.length - 1; p++) {
      if(!fs.existsSync(cwd)) {
        fs.mkdirSync(cwd);
      }

      cwd += '/' + split[p + 1];
    }

    fs.writeFileSync(cwd, content);
  }
};

module.exports = util;