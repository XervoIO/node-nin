module.exports = function(prompts, callback) {
	var rl = require('readline').createInterface(
	  process.stdin, process.stdout
	),
	p = 0,
	data = {};

	var get = function() {
	  var txt = prompts[p].property;

    if(prompts[p].hasOwnProperty('default') && prompts[p].default.length > 0) {
      txt += ' (' + prompts[p].default + ')';
    }

    rl.setPrompt(txt + '? ');
	  rl.prompt();
	};

	get();

	rl.on('line', function(line) {
    if(line.length > 0) {
      data[prompts[p].property] = line;
    } else if(prompts[p].hasOwnProperty('default')) {
      data[prompts[p].property] = prompts[p].default;
    } else {
      return get();
    }

    p++;

	  if(p === prompts.length) {
	    return rl.close();
	  }

	  get();

	}).on('close', function() {
	  callback(data);
	});
};