// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 1209;
var writer = require('./writeCSVFile');
// routes will go here
app.get('/:type', function(req, res) {
  if(req.params.type == 'tag'){
    var tag_id = req.param('id');
    var tag_section = req.param('section');
    var tag_comment = req.param('comment');
    var tag_tag = req.param('tag');
    var tag_contributor = req.param('contributor');
    var tag_timestamp = req.param('timestamp');
    var tag_paperID = req.param('paperid');
    var passedParam = [tag_id, tag_section, tag_comment, tag_tag, tag_contributor, tag_timestamp, tag_paperID];
    writer.write('tag',passedParam);
    res.send('Updated successfully! :' + req.params.type+':'+tag_id+'<br>' +tag_section + '<br>' + tag_comment + '<br>' + tag_tag
  + '<br>' + tag_contributor+ '<br>' + tag_timestamp+ '<br>' + tag_paperID);
  }
  else if(req.params.type == 'paper'){
    var paper_id = req.param('id');
    var paper_title = req.param('title');
    var paper_year = req.param('year');
    var paper_journalconference = req.param('journalconference');
    var paper_author = req.param('author');
    var paper_keyword = req.param('keyword');
    var paper_quality = req.param('quality');
    var paper_summary = "\""+req.param('summary')+"\"";
    var paper_timestamp = req.param('timestamp');
    var paper_contributor = req.param('contributor');
    var paper_link = req.param('link');
    var passedParam = [paper_id, paper_title, paper_year, paper_journalconference, paper_author,
     paper_keyword,paper_quality,paper_summary,paper_timestamp,paper_contributor,paper_link];
    writer.write('paper',passedParam);
    res.send('Updated successfully! :' + req.params.type+'<br>'+passedParam);
  }

});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
