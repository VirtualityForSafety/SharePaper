'use strict'

const fs = require('fs');
var contentRaw = "";
var dataArray = [];

var newLine= "\r\n";
var fields = ['Total', 'Name'];
//fs.readFile('metadata/papers.csv', 'utf8', function (err, data) {
var fileToWrite = 'metadata/tagsTest.csv';
fs.readFile(fileToWrite, 'utf8', function (err, data) {
  if (err == null) {
    contentRaw = data.toString();
    dataArray = data.split(/\r?\n/);

    fs.stat(fileToWrite, function (err, stat) {
        if (err == null) {
            console.log('File exists');

            //write the actual data and end with newline
            var newData = [ dataArray.length-1+"","related works","added tested", "Jinki","2018/12/31/13/30/28","23"];
            dataArray.push(newData);
            var csv = newData+newLine;

            fs.appendFile(fileToWrite, csv, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        }
        else {
            //write the headers and newline
            console.log('New file, just writing headers');
            fields = contentRaw;
            fs.writeFile(fileToWrite, fields, function (err, stat) {
                if (err) throw err;
                console.log('file saved');
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
    });
  }

});
