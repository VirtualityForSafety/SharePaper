const fs = require('fs');

module.exports = {
  append: function (fileToWrite, dataArray, passedParam, res) {
    fs.stat(fileToWrite, res, function (err, stat) {
        if (err == null) {
            passedParam[0] = getMaxID(dataArray)+1;
            //write the actual data and end with newline
            dataArray.push(passedParam);

            fs.writeFile(fileToWrite, flatten(dataArray), res, function (err, stat) {
            //fs.appendFile(fileToWrite, csv, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
                //res.send('Updated successfully.');
            });
        }
        else {
            //write the headers and newline
            console.log('New file, just writing headers');
            fields = contentRaw;
            fs.writeFile(fileToWrite, fields, function (err, stat) {
                if (err) throw err;
                console.log('file saved');
                //res.send('Updated successfully.');
            });
        }
    });
    return false;
},
update: function (fileToWrite, dataArray, passedParam, res) {
  var labelIndexMap = getLabelIndexMap(dataArray);
  for(var i=0; i<dataArray.length;i++){
    var data = dataArray[i];
    var id = data[0];
    //console.log(id +'\t' + passedParam[0]);
    if(id==passedParam[0]){
      console.log("Same ID found");
      //console.log(labelIndexMap);
      //console.log(passedParam[1]);
      //console.log(labelIndexMap[passedParam[1]]);
      //console.log(passedParam[2]);
      //console.log(dataArray[i][labelIndexMap[passedParam[1]]]);
      //console.log(fileToWrite);
      dataArray[i][labelIndexMap[passedParam[1]]] = passedParam[2];
      appendToNewFile(fileToWrite, flatten(dataArray), res);
    }
  }
  return false;
}
};

function getMaxID(data){
  //console.log(data);
  var maxID = 0;
  for (var i=1; i<data.length; i++) {
    var paperID = data[i][0] * 1;
    if(paperID > maxID)
      maxID = paperID;
  }
  return maxID;
}


function appendToNewFile(fileName, content, res){
  //write the actual data and end with newline
  fs.writeFile(fileName, content, function (err, stat) {
  //fs.appendFile(fileToWrite, csv, function (err) {
      if (err) throw err;
      console.log('Updated successfully.');
      res.send('Updated successfully.');
  });
}


String.prototype.allReplace = function(obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};

function flatten(dataArray){
  var result=[];
  for(var i=0; i<dataArray.length ; i++){
    if(i>0){
      for(var t=0; t<dataArray[i].length ; t++){
        if(dataArray[0][t]=='Summary' || dataArray[0][t]=='Comment' || (dataArray[i][t]+"").includes(','))
        {
            dataArray[i][t] = "\""+dataArray[i][t].allReplace({"'": '', "\"": ''})+"\"";
        }
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
