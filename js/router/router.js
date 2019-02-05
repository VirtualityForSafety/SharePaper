var bibGenerator = require('../data/bibGenerator');
var csvFileManager = require('../csvFileManager');
var serverTime = require('../server/serverTime');

module.exports = function(app){
  app.post('/:type', function(req, res) {
    var projectName = req.param('proj');
    console.log(req.params.type);
    var paper_title = req.param('title');
    var paper_bib = req.param('bib');
    var paper_doi = req.param('doi');
    var paper_id = req.param('id');
    var paper_year = req.param('year');
    var paper_journalconference = req.param('journalconference');
    var paper_author = req.param('author');
    var paper_keyword = req.param('keyword');
    var paper_quality = req.param('quality');
    var paper_summary = "\""+req.param('summary')+"\"";
    var paper_timestamp = serverTime.getCurrentTime();
    var paper_contributor = req.param('contributor');
    var paper_link = req.param('link');

    var tag_id = req.param('id');
    var tag_section = req.param('section');
    var tag_comment = req.param('comment');
    var tag_tag = req.param('tag');
    var tag_contributor = req.param('contributor');
    var tag_timestamp = serverTime.getCurrentTime();
    var tag_paperID = req.param('paperid');

    var data_type = req.param('label');
    var data_id = req.param('id');
    var data_value = req.param('value');

    var projectDescription = req.param('desc');

    try{
      //if(paper_title.length>0){
        if(req.params.type == 'title2doi')
          bibGenerator.title2doi(paper_title, false, res);
        else if(req.params.type == 'doi2bib')
          bibGenerator.doi2bib(paper_doi,paper_title, res);
        else if(req.params.type =='bib2file')
          bibGenerator.bib2file(paper_title, paper_bib, res);
          if(req.params.type == 'tag'){
            var passedParam = [tag_id, tag_section, tag_comment, tag_tag, tag_contributor, tag_timestamp, tag_paperID];
            csvFileManager.update(projectName, 'tag',passedParam, res);
            //res.send('Updated successfully! :' + req.params.type+':'+tag_id+'<br>' +tag_section + '<br>' + tag_comment + '<br>' + tag_tag
          //+ '<br>' + tag_contributor+ '<br>' + tag_timestamp+ '<br>' + tag_paperID+"<br><br><input type=\"button\" value=\"Back\" onclick=\"window.history.back()\" /> ");
          }
          else if(req.params.type == 'paper'){
            var passedParam = [paper_id, paper_title, paper_year, paper_journalconference, paper_author,
             paper_keyword,paper_quality,paper_summary,paper_timestamp,paper_contributor,paper_link];
            csvFileManager.update(projectName, 'paper',passedParam, res);
            //res.send('Updated successfully! :' + req.params.type+'<br>'+passedParam + "<br><br><input type=\"button\" value=\"Back\" onclick=\"window.history.back()\" /> ");
          }
          else if(req.params.type == 'paperpart' || req.params.type == 'tagpart'){
            var passedParam = [data_id, data_type, data_value];
            csvFileManager.update(projectName, req.params.type, passedParam, res);
            //res.send('Updated successfully! :' + req.params.type+'<br>'+passedParam + "<br><br><input type=\"button\" value=\"Back\" onclick=\"window.history.back()\" /> ");
          }
          else if(req.params.type == 'project'){
            var result = csvFileManager.add(projectName, projectDescription, res);
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
      //}
      //else
      //  console.log("ERROR: Empty title");
    }
    catch(err){
      console.log("Error catched during update.");
    }
  });
};
