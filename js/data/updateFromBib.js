const bibtexParse = require('bibtex-parse-js');

module.exports = {
  update: function (projectName, data_id, rawBibTex){ //paperId, rawBibTex) {
    var bibJson = (bibtexParse.toJSON(rawBibTex));
    updateRowFromBib(projectName, data_id, 'year', bibJson);
    updateRowFromBib(projectName, data_id, 'authors', bibJson);
    //updateRowFromBib(projectName, data_id, 'journal', bibJson);
    //updateRowFromBib(projectName, data_id, 'booktitle', bibJson);
  }
};

function updateRowFromBib(projectName, data_id, data_type, bibJson){
  var passedParam = [data_id, data_type, getEntryValue(bibJson, data_type)];
  console.log(passedParam);
  csvFileManager.update(projectName, 'paper', passedParam);
}

function getEntryValue(bibJson, data_type){
  return bibJson[0]["entryTags"][data_type];
}
