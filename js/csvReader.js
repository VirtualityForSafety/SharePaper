const fs = require('fs');
var csvParser = require('./csvParser4Server');

module.exports = {
  read: function (fileToWrite) {
    fs.readFile(fileToWrite, 'utf8', function (err, data) {
      if (err == null) {
        return new csvParser.parse(data.toString()).filter(String);
      }
      else {
        console.log("Failed to read data : "+fileToWrite);
        return undefined;
      }
    });
  }
};
