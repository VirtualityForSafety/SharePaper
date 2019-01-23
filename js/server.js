// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 1209;
var csvFileManager = require('./csvFileManager');
var connect = require('connect');
var serveStatic = require('serve-static');

function zeroPad(nr,base){
  var  len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

function getCurrentTime(){
  var date = new Date();
  var dateUTC = convertLocalDateToUTCDate(date);
  return dateUTC;
}

function convertLocalDateToUTCDate(date) {
  var newDate = new Date(date.getTime()-date.getTimezoneOffset()*60*1000);
  
  var offset = date.getTimezoneOffset() / 60;
  console.log(offset);
  var hours = date.getHours();
  newDate.setHours(hours + offset);
  var datevalues = [
    zeroPad(newDate.getFullYear(),1000),
    zeroPad(newDate.getMonth()+1,10),
    zeroPad(newDate.getDate()-1,10),
    zeroPad(newDate.getHours(),10),
    zeroPad(newDate.getMinutes(),10),
    zeroPad(newDate.getSeconds(),10)
  ];
   return datevalues.join('/');
}

// routes will go here
app.get('/:type', function(req, res) {
  if(req.params.type == 'tag'){
    var projectName = req.param('proj');
    var tag_id = req.param('id');
    var tag_section = req.param('section');
    var tag_comment = req.param('comment');
    var tag_tag = req.param('tag');
    var tag_contributor = req.param('contributor');
    var paper_timestamp = getCurrentTime();
    var tag_paperID = req.param('paperid');
    var passedParam = [tag_id, tag_section, tag_comment, tag_tag, tag_contributor, tag_timestamp, tag_paperID];
    csvFileManager.update(projectName, 'tag',passedParam);
    res.send('Updated successfully! :' + req.params.type+':'+tag_id+'<br>' +tag_section + '<br>' + tag_comment + '<br>' + tag_tag
  + '<br>' + tag_contributor+ '<br>' + tag_timestamp+ '<br>' + tag_paperID+"<br><br><input type=\"button\" value=\"Back\" onclick=\"window.history.back()\" /> ");
  }
  else if(req.params.type == 'paper'){
    var projectName = req.param('proj');
    var paper_id = req.param('id');
    var paper_title = req.param('title');
    var paper_year = req.param('year');
    var paper_journalconference = req.param('journalconference');
    var paper_author = req.param('author');
    var paper_keyword = req.param('keyword');
    var paper_quality = req.param('quality');
    var paper_summary = "\""+req.param('summary')+"\"";
    var paper_timestamp = getCurrentTime();
    var paper_contributor = req.param('contributor');
    var paper_link = req.param('link');
    var passedParam = [paper_id, paper_title, paper_year, paper_journalconference, paper_author,
     paper_keyword,paper_quality,paper_summary,paper_timestamp,paper_contributor,paper_link];
    csvFileManager.update(projectName, 'paper',passedParam);
    res.send('Updated successfully! :' + req.params.type+'<br>'+passedParam + "<br><br><input type=\"button\" value=\"Back\" onclick=\"window.history.back()\" /> ");
  }
  else if(req.params.type == 'paperpart' || req.params.type == 'tagpart'){
    var projectName = req.param('proj');
    var data_type = req.param('label');
    var data_id = req.param('id');
    var data_value = req.param('value');
    var passedParam = [data_id, data_type, data_value];
    csvFileManager.update(projectName, req.params.type, passedParam);
    res.send('Updated successfully! :' + req.params.type+'<br>'+passedParam + "<br><br><input type=\"button\" value=\"Back\" onclick=\"window.history.back()\" /> ");
  }
  else if(req.params.type == 'project'){
    var projectName = req.param('proj');
    var projectDescription = req.param('desc');
    var result = csvFileManager.add(projectName, projectDescription);
    if(result<0){
      res.send('Failed to create project <b>'+projectName+"</b><br><b>"+projectName + '</b> project already exists.');
    }
    else if(result ==0){
      res.send('Failed to create project '+projectName);
    }
    else{
      res.send(projectName + ' succesfully created!');
    }
  }
});

connect().use(serveStatic("./")).listen(4000, function(){
  // start the server
  app.listen(port);
  console.log('data server started! At http://localhost:' + port);
    console.log('web server running on 4000...');
});
