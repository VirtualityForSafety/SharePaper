const fs = require('fs');
var csvParser = require('./csvParser4Server');

module.exports = {
  read: function (fileToWrite, callback) {
    fs.readFile(fileToWrite, 'utf8', function (err, data) {
      if (err == null) {
        var content= csvParser.parse(data.toString()).filter(String);
        callback(null, content);
      }
      else {
        console.log("Failed to read data : "+fileToWrite);
        return undefined;
      }
    });
  }
};
