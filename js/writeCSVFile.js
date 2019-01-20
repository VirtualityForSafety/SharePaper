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

///////////////////////////////////////////////////////////////////////////////////////////
// copy and paste from csvParser.js
function parseText(allText){
  var allTextLines = allText.split(/\r\n|\n/);
  var data = new Array;
  for (var i = 0; i < allTextLines.length; i++) {
    if(allTextLines[i].length==0)
      continue;
    data[i] = parseLine(allTextLines[i]);
  }
  return data;
}

function flatten(dataArray){
  var result=[];
  for(var i=0; i<dataArray.length ; i++){
    if(i>0){
      for(var t=0; t<dataArray[i].length ; t++){
        if(dataArray[0][t]=='Summary' || dataArray[0][t]=='Comment' || dataArray[i][t].includes(','))
          dataArray[i][t] = "\""+dataArray[i][t]+"\"";
      }
    }
    result.push(dataArray[i].join(","));
  }
  return result.join("\n");
}

function parseLine(oneLine){
  var parsedData = [];
  var item="";
  var integrating = false;
    var data = oneLine.split(',');
    for (var i=0; i<data.length; i++){
      if(!integrating)
        item = data[i];
      else {
        //item += "," + data[i];
        if(!data[i].includes('\"')) item += "," + data[i];
      }
      //if ((data[i].match(/'\"'/g) || []).length>0){
      if(data[i].includes('\"')){
        var splited = data[i].split('\"');
        if(!integrating)
          item = (splited[0].length > splited[1].length)? splited[0] : splited[1];
        else
          item += (splited[0].length > splited[1].length)? ", "+splited[0] : splited[1];
        integrating = !integrating;
      }
      if(!integrating)
        parsedData.push(item);
    }
    return parsedData;
}
///////////////////////////////////////////////////////////////////////////////////////////

function appendToNewFile(fileName, content){
  //write the actual data and end with newline
  fs.writeFile(fileName, content, function (err, stat) {
  //fs.appendFile(fileToWrite, csv, function (err) {
      if (err) throw err;
      console.log('Updated successfully.');
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
    var existingID = (dataArray[i][0] * 1);
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
    var existingID = dataArray[i][0];
    if(passedID == existingID){
      console.log("- we found the corresponding data and update.");
      dataArray[i] = passedParam;
      return flatten(dataArray);
    }
  }
  // get maximum id
  console.log("- we create new row for this");
  passedParam[0] = getMaxID(dataArray)+1;
  dataArray.push(passedParam);
  return flatten(dataArray);
}

function getLabelIndexMap(dataArray){
  var labelIndexMap = {};
  var labelArray = dataArray[0];
  for(var i=0; i<labelArray.length ; i++)
    labelIndexMap[labelArray[i].replace('/','').toLowerCase()] = i;
  return labelIndexMap;
}

function partialUpdate(fileToWrite, dataArray, passedParam){
  var labelIndexMap = getLabelIndexMap(dataArray);
  for(var i=0; i<dataArray.length;i++){
    var data = dataArray[i][0];
    var id = data[0];
    if(id==passedParam[0]){
      console.log("Same ID found");
      console.log(labelIndexMap);
      console.log(passedParam[1]);
      console.log(labelIndexMap[passedParam[1]]);
      console.log(passedParam[2]);
      console.log(dataArray[i][labelIndexMap[passedParam[1]]]);
      dataArray[i][labelIndexMap[passedParam[1]]] = passedParam[2];
      return appendToNewFile(fileToWrite, flatten(dataArray));
    }
  }
  return false;
}

module.exports = {
  write: function (type, passedParam) {
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

    fs.readFile(fileToWrite, 'utf8', function (err, data) {
      if (err == null) {
        contentRaw = data.toString();
        var dataArrayUnfiltered = parseText(data);
        var dataArray = dataArrayUnfiltered.filter(String);

        if(type=='tagpart' || type=='paperpart'){
          console.log(passedParam);
          return partialUpdate(fileToWrite, dataArray, passedParam);
        }

        fs.stat(fileToWrite, function (err, stat) {
            if (err == null) {
              return appendToNewFile(fileToWrite, updateData(dataArray, passedParam));
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
