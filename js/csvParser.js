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
    //console.log(allTextLines[i]+"\n"+data[i]);
  }
  return data;
}

function countPattern(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function strip(str, remove) {
  while (str.length > 0 && remove.indexOf(str.charAt(0)) != -1) {
    str = str.substr(1);
  }
  while (str.length > 0 && remove.indexOf(str.charAt(str.length - 1)) != -1) {
    str = str.substr(0, str.length - 1);
  }
  return str;
}

function parseLine(oneLine){
  var parsedData = [];
  var item="";
  var integrating = false;
    var data = oneLine.split(',');
    for (var i=0; i<data.length; i++){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      data[i] = strip(data[i], "'"); //element validation
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if(!integrating)
        item = data[i];
      else {
        //item += "," + data[i];
        if(!data[i].includes('\"')) item += "," + data[i];
      }
      //if ((data[i].match(/'\"'/g) || []).length>0){
      if(data[i].includes('\"')){
        var splited = data[i].split('\"');
        if(countPattern(data[i],'\"')==2){
          for(var t=0 ; t<splited.length ; t++){
            if(splited[t].length==0)
              continue;
            item = splited[t];
          }
        }
        else{
          if(!integrating)
            item = (splited[0].length > splited[1].length)? splited[0] : splited[1];
          else
            item += (splited[0].length > splited[1].length)? ", "+splited[0] : splited[1];
          integrating = !integrating;
        }
      }
      if(!integrating)
        parsedData.push(strip(item,"'"));
    }
    return parsedData;
}
