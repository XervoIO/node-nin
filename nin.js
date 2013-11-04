var fs = require('fs'),
    path = require('path'),
    util = require('./lib/util'),
    prompt = require('./lib/prompt'),
    figg = require('./config');

if(process.argv.length < 3) {
  console.log('Please provide a template.');
  process.exit(0);
}

var tpl = __dirname + '/packages/' + process.argv[2];

if(!fs.existsSync(tpl)) {
  console.log('Template could not be found: ' + process.argv[2]);
  process.exit(0);
}

//Combine the template's config with the main one
figg = util.merge(figg, require(tpl + '/config'));

prompt(figg.prompts, function(prompts) {
  //Add a few things to the package.json
  figg['package.json'] = util.merge(figg['package.json'], {
    name: prompts.name,
    description: prompts.description,
    version: prompts.version,
    main: prompts.main
  });

  var files = util.readDir(tpl + '/raw', tpl + '/raw');

  //Run the generator for the template
  require(tpl + '/run')(figg, prompts, files);

  //Rename the the main file to what the package.json says it is
  if(files.hasOwnProperty('main.js')) {
    files[figg['package.json'].main] = files['main.js'];
    delete files['main.js'];
  }

  //Write the files
  var fSplit = [];
  for(var f in files) {
    util.writeFile(f, files[f]);
  }

  //save the package.json
  fs.writeFileSync('package.json', JSON.stringify(figg['package.json'], null, 2));
});