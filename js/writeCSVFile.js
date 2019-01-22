'use strict'

var labelParser = require('./csvParser4Server');
var dataParser = require('./sortableTableGenerator');

const fs = require('fs');
var contentRaw = "";
var dataArray = [];
var fields = "";
var newLine= "\r\n";
//fs.readFile('metadata/papers.csv', 'utf8', function (err, data) {
var fileToWrite = '';
var paperFile = 'metadata/papers.csv';
var tagFile = 'metadata/tags.csv';
var columnFile = 'metadata/columns.csv';
module.exports = {
  write: function (type, passedParam) {
    if(type=='tag'){
      fields = "ID,Section,Comment,Tag,Contributor,Timestamp,Paper ID" + newLine;
      fileToWrite = tagFile;
    }
    else if(type=='paper'){
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
        dataArray = labelParser.parse(contentRaw);

        fs.stat(fileToWrite, function (err, stat) {
            if (err == null) {
                console.log('File exists');
                passedParam[0] = getMaxPaperID(dataArray)+1;
                //write the actual data and end with newline
                dataArray.push(passedParam);

                fs.writeFile(fileToWrite, contentRaw+passedParam+newLine, function (err, stat) {
                //fs.appendFile(fileToWrite, csv, function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                    return true;
                });
            }
            else {
                //write the headers and newline
                console.log('New file, just writing headers');
                fields = contentRaw;
                fs.writeFile(fileToWrite, fields, function (err, stat) {
                    if (err) throw err;
                    console.log('file saved');
                    return true;
                });
            }
        });
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

function getMaxPaperID(data){
  var maxID = 0;
  for (var i=1; i<data.length; i++) {
    var paperID = data[i][0] * 1;
    if(paperID > maxID)
      maxID = paperID;
  }
  return maxID;
}
