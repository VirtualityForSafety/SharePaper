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
module.exports = {
  write: function (projectName, type, passedParam) {
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

        if(type=='tagpart' || type=='paperpart'){
          return partialUpdate(fileToWrite, dataArray, passedParam);
        }

        fs.stat(fileToWrite, function (err, stat) {
            if (err == null) {
                console.log('File exists');
                passedParam[0] = getMaxID(dataArray)+1;
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

function appendToNewFile(fileName, content){
  //write the actual data and end with newline
  fs.writeFile(fileName, content, function (err, stat) {
  //fs.appendFile(fileToWrite, csv, function (err) {
      if (err) throw err;
      console.log('Updated successfully.');
      return true;
  });
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

function getLabelIndexMap(dataArray){
  var labelIndexMap = {};
  var labelArray = dataArray[0];
  for(var i=0; i<labelArray.length ; i++)
    labelIndexMap[labelArray[i].replace(' ', '').replace('/','').toLowerCase()] = i;
  return labelIndexMap;
}

function partialUpdate(fileToWrite, dataArray, passedParam){
  var labelIndexMap = getLabelIndexMap(dataArray);
  for(var i=0; i<dataArray.length;i++){
    var data = dataArray[i];
    var id = data[0];
    console.log(id +'\t' + passedParam[0]);
    if(id==passedParam[0]){
      console.log("Same ID found");
      console.log(labelIndexMap);
      console.log(passedParam[1]);
      console.log(labelIndexMap[passedParam[1]]);
      console.log(passedParam[2]);
      console.log(dataArray[i][labelIndexMap[passedParam[1]]]);
      console.log(fileToWrite);
      dataArray[i][labelIndexMap[passedParam[1]]] = passedParam[2];
      return appendToNewFile(fileToWrite, flatten(dataArray));
    }
  }
  return false;
}

function getMaxID(data){
  var maxID = 0;
  for (var i=1; i<data.length; i++) {
    var paperID = data[i][0] * 1;
    if(paperID > maxID)
      maxID = paperID;
  }
  return maxID;
}
