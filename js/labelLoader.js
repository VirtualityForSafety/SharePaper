function generateLabel(type, data) {
  var header = data[0];
  var groupIndex = header.indexOf("Group");
  var nameIndex = header.indexOf("Name");
  var descriptionIndex = header.indexOf("Description");
  var result = {};
  for (var i=1; i<data.length; i++) {
    var line = data[i];
    if(line[groupIndex]!=type)
      continue;
    result[line[nameIndex]] = line[descriptionIndex];
  }
  return result;
}

function getTagHeader(data){
  var header = data[0];
  var groupIndex = header.indexOf("Group");
  var nameIndex = header.indexOf("Name");
  var result = [];
  for (var i=1; i<data.length; i++) {
    var line = data[i];
    if(line[groupIndex]!="Tag")
      continue;
    result.push(line[nameIndex]);
  }
  return result;
}

function getValueMap(data){
  values = data.split('/');
  var mapData = new Map();
  for(var i=0; i<values.length ; i++){
    mapData.set(values[i],i);
  }
  return mapData;
}

function getLabelPriorityMap(type, data){
  var header = data[0];
  //var nameIndex = header.indexOf("Name");
  var groupIndex = header.indexOf("Group");
  var valueIndex = header.indexOf("Value");
  var result = [];
  for (var i=1; i<data.length; i++) {
    var line = data[i];
    if(line[groupIndex]!=type)
      continue;
    if(line[valueIndex].length>0)
      result.push(getValueMap(line[valueIndex]));
    else
      result.push(new Map());
  }
  return result;
}
