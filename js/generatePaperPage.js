
$(document).ready(function() {
  $.ajax({
     type: "GET",
     url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = readCSV(csvData);
         var paperColumns = generatePaperColumn(csvDataText);
         var tagColumns = generateTagColumn(csvDataText);
         tagHeader = getTagHeader(csvDataText);
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
                     var paperID = getPaperID();

                     if(paperID>=0)
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

// returns a paperId, but a negative value for invalid link
function getPaperID(){
  var element = window.location.href.split('?');
  if(element.length>1){
    var id = element[element.length -1].split('=')[1];
    return id;
  }
  return -1;
}

function getPaperUpdateButton(){
  var buttonScript = "";
  var link = "window.location.href='http://localhost:1209/paper?"; //"+getTagParameters(tagColumns, tagArray[paperID][i])+"'";
  return "<input type=\"button\" value=\"Submit\" onclick=\""+link+"\">";
}

function generatePaperPart(paperID, paperArray, paperColumns){
  var result = "<table id=\"paperTable\"><tr>";
  // for header
  var index =0;
  var keys = [];
  for (var key in paperColumns) {
    if (paperColumns.hasOwnProperty(key)) {
      keys.push(key+"");
      index += 1;
      if(index==1)
        result+= "<th style=\"display:none;\">"+ key + "</th>";
      else {
        result+= "<th><a class=\"tip\">"+ key + "<span class=\"description\">"+paperColumns[key]+"</span></a></th>";
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
      if(i==paperArray[paperID].length-1)
        result += "<td><a href=\"resources/"+paperArray[paperID][i]+".pdf\" download>download</a></td>";
      else
        result +="<td><textarea id=\"paper_"+keys[i].toLowerCase()+"\" cols=\"20\">"+paperArray[paperID][i]+"</textarea></td>";
    }
    result += "</tr>";
  }
  return result + "</table>" + "<br>" + getPaperUpdateButton();
}

function getNewEntryParameters(tagColumns, id,item){
  var result ="";
  for (var i=0 ; i<tagColumns.length ; i++) {
    if(i==0){
        result+= tagColumns[i].replace(/ /g,"").toLowerCase() + "=" + id+"&";
      continue;
    }
    else{
        result+= tagColumns[i].replace(/ /g,"").toLowerCase() + "=" + item[i-1]+"&";
    }
  }
  return result;
}

function getTagParameters(tagColumns, item){
  var result ="";
  var index =0;
  for (var key in tagColumns) {
    if (tagColumns.hasOwnProperty(key)) {
      //id="+tagArray[paperID][i][0]+"&section="+tagArray[paperID][i][1]+"&comment="+tagArray[paperID][i][2]+"&tag="+tagArray[paperID][i][3]+"'";

      result+= key.replace(/ /g,"").toLowerCase() + "=" + item[index]+"&";
      index+=1;
    }
  }
  return result;
}

function generateTagPart(paperID, tagArray, tagColumns){
  var result = "<table id=\"tagTable\"><tr>";
  // for header
  var columnLength =0;
  var keys = [];
  for (var key in tagColumns) {
    if (tagColumns.hasOwnProperty(key)) {
      keys.push(key+"");
      columnLength += 1;
      if(columnLength==1)
        result+= "<th style=\"display:none;\">"+ key + "</th>";
      else if(key=="Paper ID"){
          result+= "<th>Edit</th>";
        }
      else {
        result+= "<th><a class=\"tip\">"+ key + "<span class=\"description\">"+tagColumns[key]+"</span></a></th>";
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
        if(k==tagArray[paperID][i].length-1){
          //var link = "window.location.href='http://localhost:1209/tag?id="+tagArray[paperID][i][0]+"&section="+tagArray[paperID][i][1]+"&comment="+tagArray[paperID][i][2]+"&tag="+tagArray[paperID][i][3]+"'";
          var link = "window.location.href='http://localhost:1209/tag?"+getTagParameters(tagColumns, tagArray[paperID][i])+"'";
          result += "<td><input type=\"button\" value=\"Submit\" onclick=\""+link+"\"></td>";
        }
        else
          result +="<td><textarea cols=\"20\">"+tagArray[paperID][i][k]+"</textarea></td>";
      }
      result += "</tr>";
    }

    // for new entry
    result += "<tr>";
    //*
    for(var k=0; k<columnLength-1; k++){
      if(k==columnLength-2){
        //var link = "window.location.href='http://localhost:1209/tag?id="+tagArray[paperID][i][0]+"&section="+tagArray[paperID][i][1]+"&comment="+tagArray[paperID][i][2]+"&tag="+tagArray[paperID][i][3]+"'";

        //var link = "window.location.href='http://localhost:1209/tag?"+getParameters(tagColumns, 10000, newItemArray)+"'";
        //result += "<td><input type=\"button\" value=\"Submit\" onclick=\""+link+"\"></td>";
        result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter("+paperID+")\"></td>";
      }
      else{
          result +="<td><textarea id=\"new_"+keys[k+1].toLowerCase()+"\" cols=\"20\"></textarea></td>";
      }
    }
    //*/
    result += "</tr>";
  }
  return result + "</table>";
}

function passNewEntryParameter(paperID){
  var section = $('textarea#new_section').val();
  var comment = $('textarea#new_comment').val();
  var tag = $('textarea#new_tag').val();
  var contributor = $('textarea#new_contributor').val();
  var timestamp = $('textarea#new_timestamp').val();

  var newItemArray = [section,comment,tag,contributor,timestamp,paperID+""];
  console.log(newItemArray);
  console.log(getNewEntryParameters(tagHeader, 10000, newItemArray));
  window.location.href='http://localhost:1209/tag?'+getNewEntryParameters(tagHeader, 10000, newItemArray);
}
