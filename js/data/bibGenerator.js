const https = require('https');
var querystring = require("querystring");
var urllib = require('urllib');
var levenshtein = require('fast-levenshtein');
var exec = require('child_process').exec;
const fs = require('fs');
const addProject = require('./addProject');
const parser = require('../csvParser4Server');


module.exports = {
  doi2bib: function (projectName, paperId, title) {
    getBibtexByTitle(projectName, parser.strip(paperId,"'"), title);
  }
};

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

var child;

function getBibtexByTitle(projectName, paperId, title){
  var api_url = "https://api.crossref.org/works?";
  var params = {"rows": "5", "query.title": title};
  var paramString = querystring.stringify(params);
  console.log(api_url + paramString);

  urllib.request(api_url + paramString, function (err, data, res) {
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

  else {
    console.log(most_similar);
    var doi = most_similar["doi"];

    console.log("We found a paper by the given title: " +doi);
    var command = 'curl -sLH "Accept: text/bibliography; style=bibtex" http://dx.doi.org/' + doi;
    child = exec(command,
       function (error, stdout, stderr) {
          if (error !== null) {
              console.log('exec error: ' + error);
          }
          else{
            console.log("We found a bibtex!");
            writeBibtex(projectName, paperId, stdout);
            //console.log('stdout: ' + stdout);
          }
       });
  }
});

function writeBibtex(projectName, paperId, text){
  var dir = "./metadata/"+projectName+"/bib/";
  addProject.createFolder(dir);
  fs.writeFile(dir+paperId+'.bib', text, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The bibtex file was saved to "+dir+"!");
  });
}

/*


  request
    .get(api_url+paramString)
    .on('response', function(response) {
    console.log(response.statusCode); // 200
    console.log(JSON.parse(response.body)); // 'image/png'
  });

request({
    headers: {
      'User-Agent': 'SharePaper DOI Importer (mailto:your.jinki.jung@gmail.com)',
      'Content-Type': 'application/json'
    },
    uri: api_url,
    body: paramString,
    method: 'GET'
  }, function (err, res) {
    console.log(JSON.parse(res.body));
  });

  /*


  https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data).explanation);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });


  var request = Request(url)
  request.add_header("User-Agent", "OpenAPC DOI Importer (https://github.com/OpenAPC/openapc-de/blob/master/python/import_dois.py; mailto:openapc@uni-bielefeld.de)")
  try:
      ret = urlopen(request)
      content = ret.read()
      data = json.loads(content)
      items = data["message"]["items"]
      most_similar = EMPTY_RESULT
      for item in items:
          title = item["title"].pop()
          result = {
              "crossref_title": title,
              "similarity": ratio(title.lower(), params["query.title"].lower()),
              "doi": item["DOI"]
          }
          if most_similar["similarity"] < result["similarity"]:
              most_similar = result
      return {"success": True, "result": most_similar}
  except HTTPError as httpe:
      return {"success": False, "result": EMPTY_RESULT, "exception": httpe}
      */
}


/*
module.exports.doi2bib = function(callback){
    execute("git config --global user.name", function(name){
        execute("git config --global user.email", function(email){
            callback({ name: name.replace("\n", ""), email: email.replace("\n", "") });
        });
    });
};

module.exports = {
  doi2bib: function (doi) {
    execute('curl -sLH "Accept: text/bibliography; style=bibtex" ' +
       'http://dx.doi.org/' + doi, function(result){
            callback({ result: name.replace("\n", "")});
        });
}
};
*/
