// from http://jsfiddle.net/mblase75/dcqxr/

$(document).ready(function() {
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
        dataType: "text",
        success: function(data) {
            columnDescription = csvToColumnInfo(data); }
     });
     $('.show_hide').click(function(){
        $(this).next('.slidingDiv').slideToggle();
         return false;
    });
});


function csvToColumnInfo(allText) {
  var result = {};
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');

  var header = allTextLines[0].split(',');
  var groupIndex = header.indexOf("Group");
  var nameIndex = header.indexOf("Name");
  var descriptionIndex = header.indexOf("Description");

  for (var i=1; i<allTextLines.length; i++) {
    if(allTextLines[i].length==0)
      continue;
    var data = parseLine(allTextLines[i]);
    if(data[groupIndex]!="Paper")
      continue;
    result[data[nameIndex]] = data[descriptionIndex];
  }
  return result;
}

function parseLine(oneLine){
  var parsedData = [];
  var integrating = false;
    var data = oneLine.split(',');
    for (i=0; i<data.length; i++){
      if(!integrating)
        item = data[i];
      else {
        item += "," + data[i];
      }
      //if ((data[i].match(/'\"'/g) || []).length>0){
      if(data[i].includes('\"')){
        splited = data[i].split('\"');
        if(!integrating)
          item = (splited[0].length > splited[1].length)? splited[0] : splited[1];
        else
          item += (splited[0].length > splited[1].length)? splited[0] : splited[1];
        integrating = !integrating;
      }
      if(!integrating)
        parsedData.push(item);
    }
    /*
    var start = oneLine.indexOf("\"");
    var end   = oneLine.indexOf("\"", start+1);
    var substring = oneLine.substring(start, end);

    var replaced_substring = substring.replace(/,/g," &");
    var new_string = data[0] + replaced_substring + data[2];*/
    return parsedData;
}
