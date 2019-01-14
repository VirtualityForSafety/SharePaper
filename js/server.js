// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 1209;
var writer = require('./writeCSVFile');

// routes will go here
app.get('/:type', function(req, res) {
  var tag_id = req.param('id');
  var tag_section = req.param('section');
  var tag_comment = req.param('comment');
  var tag_tag = req.param('tag');
  var tag_contributor = req.param('contributor');
  var tag_timestamp = req.param('timestamp');
  var tag_paperID = req.param('paperID');
  writer.write();
  res.send(req.params.type+' '+tag_section + ' ' + tag_comment + ' ' + tag_tag);
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
