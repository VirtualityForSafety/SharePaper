'use strict'

var labelParser = require('./csvParser4Server');
var dataParser = require('./sortableTableGenerator');
var dataWriter = require('./csvWriter');
var projectCreator = require('./data/addProject');
var csvReader = require('./csvReader');
var csvWriter = require('./csvWriter');

const fs = require('fs');
var contentRaw = "";
var dataArray = [];
var fields = "";
var newLine= "\r\n";
//fs.readFile('metadata/papers.csv', 'utf8', function (err, data) {
var fileToWrite = '';
module.exports = {
  add: function (projectName, projectDescription) {
    var result = projectCreator.add(projectName);
    if(result>0){ // update succeeded
      var dataArray = appendToData('metadata/proj.csv',['99999',projectName,projectDescription]);
    }
    return result;
  },
  update: function (projectName, type, passedParam) {
    var paperFile = 'metadata/'+projectName+'/papers.csv';
    var tagFile = 'metadata/'+projectName+'/tags.csv';
    var columnFile = 'metadata/'+projectName+'/columns.csv';
    if(type=='tag' || type=='tagpart' ){
      fields = "ID,Section,Comment,Tag,Contributor,Timestamp,Paper ID" + newLine;
      fileToWrite = tagFile;
    }
    else if(type=='paper' || type=='paperpart' ){
      fields = "ID,Title,Year,Journal/Conference,Author,Keyword,Quality,Summary,Timestamp,Contributor,Link" + newLine;
      fileToWrite = paperFile;
    }
    if(passedParam==undefined || passedParam[0]==undefined)
      return false;

/*
    var columnInfo ;
    fs.readFile(columnFile, 'utf8', function (err, data){
      if(err==null){
        columnInfo = labelParser.parse(data.toString());
      }
    });
*/
    fs.readFile(fileToWrite, 'utf8', function (err, data) {
      if (err == null) {
        contentRaw = data.toString();
        dataArray = labelParser.parse(contentRaw).filter(String);

        if(type=='tagpart' || type=='paperpart')
          return dataWriter.update(fileToWrite, dataArray, passedParam);

        return dataWriter.append(fileToWrite, dataArray, passedParam);
      }
      else {
        //write the headers and newline
        console.log('New file, just writing headers');
        fs.writeFile(fileToWrite, fields+passedParam+newLine, function (err, stat) {
            if (err) throw err;
            console.log('file saved');
            return true;
        });
      }

    });
  }
};

function appendToData(fileToRead, newElement){
  fs.readFile(fileToRead, 'utf8', function (err, data) {
    if (err == null) {
      contentRaw = data.toString();
      var dataArray = labelParser.parse(contentRaw).filter(String);
      csvWriter.append('metadata/proj.csv', dataArray, newElement);
    }
    else {
      return null;
    }
  });
}
