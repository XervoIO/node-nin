module.exports = function(figg, prompts, files) {
  var ve = prompts['view engine'];

  if(!figg['view engines'].hasOwnProperty(ve)) {
    console.log('View Engine not supported, using EJS: ' + ve);
    ve = 'ejs';
  }

  figg['package.json'].dependencies[ve] = figg['view engines'][ve];

  //Few variable replacements
  files['main.js'] = files['main.js'].replace(/%view engine%/g, "'" + ve + "'");
  files['main.js'] = files['main.js'].replace(/%port%/g, 8080);
};