const https = require('https');
var querystring = require("querystring");
var urllib = require('urllib');
var levenshtein = require('fast-levenshtein');
var exec = require('child_process').exec;
const fs = require('fs');
const addProject = require('./addProject');
const parser = require('../csvParser4Server');

const bibDir = "./resources/bib/";

module.exports = {
  title2bib: function (title) {
    title = parser.strip(title,"'");
    return module.exports.title2doi(title, true);
  },
  doi2bib: function (doi, paperId , passedRes = undefined) {
    var command = 'curl -sLH "Accept: text/bibliography; style=bibtex" http://dx.doi.org/' + doi;
    child = exec(command,
       function (error, stdout, stderr) {
          if (error !== null) {
              console.log('exec error: ' + error);
          }
          else{
            console.log("We found a bibtex!");
            writeBibtex(paperId, stdout);
            if(passedRes!=undefined)
            {
              passedRes.send(stdout);
            }
            return stdout;
            //console.log('stdout: ' + stdout);
          }
       });
  },
  title2doi: function(title, convert2DOI = false, passedRes = undefined){
    var paperId = title;
    var api_url = "https://api.crossref.org/works?";
    var params = {"rows": "10", "query.title": title};
    var paramString = querystring.stringify(params);
    //console.log(api_url + paramString);
    urllib.request(api_url + paramString,{ timeout: 10000 }, function (err, data, res) {
      if(err){
        throw(err);
      }
      if(res.statusCode <0) //connection failed
        return;
    //console.log(res.headers);
    // data is Buffer instance
    var items = JSON.parse(data.toString())["message"]["items"];
    var most_similar = undefined;
    for(var i=0; i<items.length ; i++){
      var item = items[i];
      var title = item["title"];
      console.log(title);
      var result = {
                  "title": title[0],
                  "LD": levenshtein.get(title[0].toLowerCase(), params["query.title"].toLowerCase()),
                  "doi": item["DOI"]
              };
      if (most_similar==undefined || most_similar["LD"] > result["LD"])
              most_similar = result;
    }

    if(most_similar==undefined){
      console.log("ERROR: Failed to find any paper with the given title.");
      return undefined;
    }
    else if(most_similar["LD"]>=30){
      console.log("ERROR: Failed to find any paper with the given title.");
      return undefined;
    }

    var doi = most_similar["doi"];
    console.log("We found a paper by the given title: " +doi);
    passedRes.send(doi);
    if(convert2DOI){
      return module.exports.doi2bib(doi, paperId, passedRes);
    }
    return undefined;
  });
  }
};

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

var child;

function writeBibtex(paperId, text){
  addProject.createFolder(bibDir);
  var fileName= parser.getWritableName(paperId);
  fs.writeFile(bibDir+fileName+'.bib', text, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The bibtex file was saved: "+fileName+"!");
  });
}
