var bibGenerator = require('../data/bibGenerator');
module.exports = function(app){
  app.post('/:type', function(req, res) {
    console.log(req.params.type);
    var paper_title = req.param('title');
    var paper_bib = req.param('bib');
    var paper_doi = req.param('doi');
    console.log(paper_title);
    console.log(paper_bib);
    console.log(paper_doi);
    try{
      if(paper_title.length>0){
        if(req.params.type == 'title2doi')
          bibGenerator.title2doi(paper_title, false, res);
        else if(req.params.type == 'doi2bib')
          bibGenerator.doi2bib(paper_doi,paper_title, res);
        else if(req.params.type =='bib2file')
          bibGenerator.bib2file(paper_title, paper_bib, res);
      }
      else
        console.log("ERROR: Empty title");
    }
    catch(err){
      console.log("Error");
    }
  });
};
