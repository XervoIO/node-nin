var express = require('express'),
    app = express();

app.set('view engine', %view engine%);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.listen(%port%);
console.log('App running on port %port%');