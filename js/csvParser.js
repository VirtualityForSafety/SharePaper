/*
module.exports = {
  parse: function (allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var data = new Array;
    for (var i = 0; i < allTextLines.length; i++) {
      if(allTextLines[i].length==0)
        continue;
      data[i] = parseLine(allTextLines[i]);
    }
    return data;
}
};
*/

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
