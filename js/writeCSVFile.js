'use strict'

const fs = require('fs');
var contentRaw = "";
var dataArray = [];
var fields = [];
var newLine= "\r\n";
//fs.readFile('metadata/papers.csv', 'utf8', function (err, data) {
var fileToWrite = 'metadata/tagsTest.csv';
module.exports = {
  write: function (passedParam) {
    if(passedParam==undefined || passedParam[0]==undefined)
      return false;
    console.log(passedParam);
    fs.readFile(fileToWrite, 'utf8', function (err, data) {
      if (err == null) {
        contentRaw = data.toString();
        dataArray = data.split(/\r?\n/);

        fs.stat(fileToWrite, function (err, stat) {
            if (err == null) {
                console.log('File exists');

                //write the actual data and end with newline
                var newData = passedParam;
                dataArray.push(newData);
                var csv = newData+newLine;
                fs.writeFile(fileToWrite, contentRaw+csv, function (err, stat) {
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
        fields = "ID,Section,Comment,Tag,Contributor,Timestamp,Paper ID" + newLine;
        fs.writeFile(fileToWrite, fields, function (err, stat) {
            if (err) throw err;
            console.log('file saved');
            return true;
        });
      }

    });
  }
};
