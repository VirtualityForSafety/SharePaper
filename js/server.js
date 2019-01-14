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
  var tag_paperID = req.param('paperid');
  var passedParam = [tag_id, tag_section, tag_comment, tag_tag, tag_contributor, tag_timestamp, tag_paperID];
  writer.write(passedParam);
  res.send('Updated successfully! :' + req.params.type+':'+tag_id+'<br>' +tag_section + '<br>' + tag_comment + '<br>' + tag_tag
+ '<br>' + tag_contributor+ '<br>' + tag_timestamp+ '<br>' + tag_paperID);
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
