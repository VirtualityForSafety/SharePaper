// from http://jsfiddle.net/mblase75/dcqxr/

$(document).ready(function() {
  $.ajax({
     type: "GET",
     url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
         var paperColumns = generatePaperColumn(readCSV(csvData));
         var tagColumns = generateTagColumn(readCSV(csvData));
         $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
            dataType: "text",
            success: function(csvData) {
                tagArray = generateTagArray(readCSV(csvData));

                $.ajax({
                   type: "GET",
                   url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
                   dataType: "text",
                   success: function(csvData) {
                     var paperID = 2;
                     paperArray = readCSV(csvData);
                     document.getElementById("paperDetail").innerHTML = generatePaperPart(paperID, paperArray, paperColumns);
                    document.getElementById("tagDetail").innerHTML = generateTagPart(paperID, tagArray, tagColumns);
                     function resizeInput() {
                      $(this).attr('size', $(this).val().length);
                    }
                   }
                     });
                   }
            });
       }
});

});

function generatePaperPart(paperID, paperArray, paperColumns){
  var result = "<table id=\"paperTable\"><tr>";
  // for header
  var index =0;
  for (var key in paperColumns) {
    if (paperColumns.hasOwnProperty(key)) {
      index += 1;
      if(index==1)
        result+= "<th style=\"display:none;\">"+ key + "</th>";
      else {
        result+= "<th><button class=\"tip\">"+ key + "<span class=\"description\">"+paperColumns[key]+"</span></button></th>";
      }
    }
  }
  result += "</tr>";
  // for paper element
  if(paperArray[paperID]!=undefined)
  {
    result += "<tr>";
    for(var i=1; i<paperArray[paperID].length ; i++){
      //result +="<td><input type=\"text\" value=\""+ paperArray[paperID][i]+"\"></td>";
      result +="<td><textarea cols=\"20\">"+paperArray[paperID][i]+"</textarea></td>";
    }
    result += "</tr>";
  }
  return result + "</table>";
}

function generateTagPart(paperID, tagArray, tagColumns){
  var result = "<table id=\"tagTable\"><tr>";
  // for header
  var columnLength =0;
  for (var key in tagColumns) {
    if (tagColumns.hasOwnProperty(key)) {
      columnLength += 1;
      if(columnLength==1)
        result+= "<th style=\"display:none;\">"+ key + "</th>";
      else {
        result+= "<th><button class=\"tip\">"+ key + "<span class=\"description\">"+tagColumns[key]+"</span></button></th>";
      }
    }
  }
  result += "</tr>";
  // for tag elements
  if(tagArray[paperID]!=undefined)
  {
    for(var i=0; i<tagArray[paperID].length ; i++){
      result += "<tr>";
      for(var k=1; k<tagArray[paperID][i].length ; k++){
        //result +=
        result +="<td><textarea cols=\"20\">"+tagArray[paperID][i][k]+"</textarea></td>";
      }
      result += "</tr>";
    }
    // for new entry
    result += "<tr>";
    for(var k=0; k<columnLength-1; k++){
      //result +=
      result +="<td><textarea cols=\"20\"></textarea></td>";
    }

    result += "</tr>";
  }
  return result + "</table>";
}
