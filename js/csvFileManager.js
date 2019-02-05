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
  test: function (){
    //loadLabels('sample','Tagpart');
  },
  add: function (projectName, projectDescription, res) {
    var result = projectCreator.add(projectName);
    if(result>0){ // update succeeded

      appendToData('metadata/proj.csv',['99999',projectName,projectDescription], res);
    }
    return result;
  },
  update: function (projectName, type, passedParam, res) {
    var paperFile = 'metadata/'+projectName+'/papers.csv';
    var tagFile = 'metadata/'+projectName+'/tags.csv';
    var columnFile = 'metadata/'+projectName+'/columns.csv';

    var fileName = "./metadata/"+projectName+"/columns.csv";

    ////////////////////////////////////////////////////////////////////////////////////
    res.send('Updated successfully.');
    ////////////////////////////////////////////////////////////////////////////////////
    csvReader.read(fileName, function (err, content) {
      var csvDataText = content;
      //console.log(getLabelForType(type.replace('part',''),content).join(',') + newLine);    //paperColumns = generateLabel("Paper", csvDataText);
      fields = getLabelForType(type.replace('part',''),content).join(',') + newLine;

      if(type=='tag' || type=='tagpart' ){
        //fields = "ID,Section,Comment,Tag,Contributor,Timestamp,Paper ID" + newLine;
        fileToWrite = tagFile;
      }
      else if(type=='paper' || type=='paperpart' ){
        //fields = "ID,Title,Year,Journal,Author,Keyword,Quality,Summary,Timestamp,Contributor,Link" + newLine;
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
            return dataWriter.update(fileToWrite, dataArray, passedParam, res);
          return dataWriter.append(fileToWrite, dataArray, passedParam, res);
        }
        else {
          //write the headers and newline
          console.log('New file, just writing headers');
          fs.writeFile(fileToWrite, fields+passedParam+newLine, function (err, stat) {
              if (err) throw err;
              console.log('file saved');
              res.send('Updated successfully.');
          });
        }

      });
    });


  }
};

function getLabelForType(type, content){
  var header = content[0];
  var groupIndex = header.indexOf('Group');
  var nameIndex = header.indexOf('Name');
  var result = [];
  for(var i=1 ; i<content.length ; i++){
    if(content[i][groupIndex].toLowerCase()==type.toLowerCase()){
        result.push(content[i][nameIndex]);
    }
  }
  return result;
}

function appendToData(fileToRead, newElement, res){
  ////////////////////////////////////////////////////////////////////////////////////
  res.send('Updated successfully.');
  ////////////////////////////////////////////////////////////////////////////////////
  fs.readFile(fileToRead, 'utf8', function (err, data) {
    if (err == null) {
      //res.send('Updated successfully.');
      contentRaw = data.toString();
      var dataArray = labelParser.parse(contentRaw).filter(String);
      csvWriter.append('metadata/proj.csv', dataArray, newElement, res);
    }
    else {
      return null;
    }
  });
}
