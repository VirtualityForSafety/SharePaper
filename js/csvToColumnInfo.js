function generatePaperColumn(data) {
  var header = data[0];
  var groupIndex = header.indexOf("Group");
  var nameIndex = header.indexOf("Name");
  var descriptionIndex = header.indexOf("Description");
  var result = {};
  for (var i=1; i<data.length; i++) {
    var line = data[i];
    if(line[groupIndex]!="Paper")
      continue;
    result[line[nameIndex]] = line[descriptionIndex];
  }
  return result;
}

function generateTagColumn(data) {
  var header = data[0];
  var groupIndex = header.indexOf("Group");
  var nameIndex = header.indexOf("Name");
  var descriptionIndex = header.indexOf("Description");
  var result = {};
  for (var i=1; i<data.length; i++) {
    var line = data[i];
    if(line[groupIndex]!="Tag")
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
