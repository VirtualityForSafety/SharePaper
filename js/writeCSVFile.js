'use strict'

const fs = require('fs');
var contentRaw = "";
var dataArray = [];
var fields = "";
var newLine= "\r\n";
//fs.readFile('metadata/papers.csv', 'utf8', function (err, data) {
var fileToWrite = '';
var paperFile = 'metadata/papers.csv';
var tagFile = 'metadata/tags.csv';


function appendToNewFile(fileName, content){
  //write the actual data and end with newline
  fs.writeFile(fileName, content, function (err, stat) {
  //fs.appendFile(fileToWrite, csv, function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
      return true;
  });
}

function createNewFile(fileName, content){
  //write the headers and newline
  console.log('New file, just writing headers');
  fs.writeFile(fileName, content, function (err, stat) {
      if (err) throw err;
      console.log('file saved');
      return true;
  });
}

function getMaxID(dataArray){
  var maxID = -1;
  for(var i=0; i<dataArray.length ; i++){
    var existingID = (dataArray[i].split(',')[0] * 1);
    if(existingID > maxID)
      maxID = existingID;
  }
  return maxID;
}

function updateData(dataArray, passedParam){
  var passedID = passedParam[0];
  for(var i=0; i<dataArray.length ; i++){
    if(dataArray[i].length==0)
      continue;
    var existingID = dataArray[i].split(',')[0];
    if(passedID == existingID){
      dataArray[i] = passedParam.join(",");
      return dataArray.join("\n");
    }
  }
  // get maximum id
  passedParam[0] = getMaxID(dataArray)+1;
  dataArray.push(passedParam);
  return dataArray.join("\n");
}

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
    console.log(passedParam);
    fs.readFile(fileToWrite, 'utf8', function (err, data) {
      if (err == null) {
        contentRaw = data.toString();
        var dataArrayUnfiltered = data.split(/\r?\n/);
        var dataArray = dataArrayUnfiltered.filter(String);
        fs.stat(fileToWrite, function (err, stat) {
            if (err == null) {
              appendToNewFile(fileToWrite, updateData(dataArray, passedParam));
            }
            else {
              return createNewFile(fileToWrite, fields+passedParam+newLine);
            }
        });
      }
      else {
        return createNewFile(fileToWrite, fields+passedParam+newLine);
      }

    });
  }
};
