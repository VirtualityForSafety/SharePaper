
$(document).ready(function() {
  $.ajax({
     type: "GET",
     //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     url: "metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = parseText(csvData);
        paperColumns = generateLabel("Paper", csvDataText);
         tagColumns = generateLabel("Tag", csvDataText);
         tagHeader = getTagHeader(csvDataText);

         $.ajax({
            type: "GET",
            //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
            url: "metadata/tags.csv",
            dataType: "text",
            success: function(csvData) {
                tagArray = generateTagArray(parseText(csvData));

                $.ajax({
                   type: "GET",
                   //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
                   url: "metadata/papers.csv",
                   dataType: "text",
                   success: function(csvData) {
                     var paperID = getPaperID();

                     if(paperID>=0)
                      paperArray = parseText(csvData);

                     document.getElementById("paperDetail").innerHTML = generatePaperPart(paperID, paperArray, paperColumns);
                    document.getElementById("tagDetail").innerHTML = generateTagPart(paperID, tagArray, tagColumns);
                     function resizeInput() {
                      $(this).attr('size', $(this).val().length);
                    }
                    $(".new_entry").hide();
                    $(".expandNewEntry").click(function () {
                        $(".new_entry").show("fast");
                    });

                    $('div[contenteditable=true]').focusin(function(){
                      console.log("!!");
                    });
                    $('div[contenteditable=true]').keydown(function(e) {
                       // trap the return key being pressed
                       if (e.keyCode == 13) {
                         // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
                         //document.execCommand('insertHTML', false, '<br><br>');
                         // prevent the default behaviour of return key pressed
                         console.log($(this).attr('id')+"\t"+$(this).html());

                         var label= ["label","id","value"];
                         var queries = $(this).attr('id').split('_');
                         queries.push($(this).html());
                         console.log(queries);
                         var result = "";
                         for(var i=0; i<label.length;i++)
                           result += label[i]+"="+queries[i]+"&";
                         window.location.href="http://localhost:1209/tagpart?"+result;
                         $(this).blur();
                         return false;
                       }
                     });
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

function getPaperUpdateButton(paperColumns){
  return "<button onclick=\"passPaperParameter()\">Submit</button>";
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
    for(var i=0; i<paperArray[paperID].length ; i++){
      //result +="<td><input type=\"text\" value=\""+ paperArray[paperID][i]+"\"></td>";
      var downloadLink = "";
      if(i==paperArray[paperID].length-1)
        downloadLink = "<br><a href=\"resources/"+paperArray[paperID][i]+".pdf\" download>download</a>";
      if(i==0)
        result +="<textarea id=\"paper_"+keys[i].toLowerCase()+"\" cols=\"20\" style=\"display:none;\">"+paperArray[paperID][i]+"</textarea>";
      else
        result +="<td><textarea id=\"paper_"+keys[i].replace("/","").toLowerCase()+"\" cols=\"20\">"+paperArray[paperID][i]+"</textarea>"+downloadLink+"</td>";

    }
    result += "</tr>";
  }
  return result + "</table>" + "<br>" + getPaperUpdateButton();
}

function getNewEntryParameters(tagColumns, item){
  var result ="";
  for (var i=0 ; i<tagColumns.length ; i++) {
        result+= tagColumns[i].replace(/ /g,"").toLowerCase() + "=" + item[i]+"&";
  }
  return result;
}

function getPaperParameters(paperColumns, item){
  var result ="";
  var index =0;
  for (var key in paperColumns) {
    if (paperColumns.hasOwnProperty(key)) {
      //id="+tagArray[paperID][i][0]+"&section="+tagArray[paperID][i][1]+"&comment="+tagArray[paperID][i][2]+"&tag="+tagArray[paperID][i][3]+"'";

      result+= key.replace("/","").toLowerCase() + "=" + item[index]+"&";
      index+=1;
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
      var id = tagArray[paperID][i][0];
      for(var k=1; k<tagArray[paperID][i].length ; k++){
        //result +=
        if(k==tagArray[paperID][i].length-1){
          //var link = "window.location.href='http://localhost:1209/tag?id="+tagArray[paperID][i][0]+"&section="+tagArray[paperID][i][1]+"&comment="+tagArray[paperID][i][2]+"&tag="+tagArray[paperID][i][3]+"'";
          var link = "window.location.href='http://localhost:1209/tag?"+getTagParameters(tagColumns, tagArray[paperID][i])+"'";
          result += "<td><button onclick=\""+link+"\">Submit</button></td>";
        }
        else
          result +="<td><div id=\""+keys[k].toLowerCase()+"_"+id+"\" contenteditable=\"true\">"+tagArray[paperID][i][k]+"</div></td>";
      }
      result += "</tr>";
    }

    // for new entry
    result += "<tr class=\"new_entry\">";
    //*
    for(var k=0; k<columnLength-1; k++){
      if(k==columnLength-2){
        var hiddenItem = "<textarea id=\"new_tag_"+keys[k+1].toLowerCase()+"\" cols=\"20\" style=\"display:none;\"></textarea>";
        result += "<td><button onclick=\"passNewTagEntryParameter("+paperID+")\">Submit</button>"+hiddenItem+"</td>";
      }
      else{
          result +="<td><textarea id=\"new_tag_"+keys[k+1].replace('/','').toLowerCase()+"\" cols=\"20\"></textarea></td>";
      }
    }
    //*/
    result += "</tr>";
  }
  return result + "</table>";
}

function passNewTagEntryParameter(paperID){

  var tagData = [];
  var tagHeader = [];
  for (var key in tagColumns) {
    if (tagColumns.hasOwnProperty(key)) {
      tagHeader.push(key.replace('/','').toLowerCase());
      var parameterName = 'textarea#new_tag_'+key.replace(" ","").toLowerCase();
      console.log(parameterName + "\t" + key);
      tagData.push($(parameterName).val());
    }
  }
  tagData[0] = 99999; // declare this is new item
  tagData[tagData.length-1] = paperID;
  console.log(getNewEntryParameters(tagHeader, tagData));
  window.location.href='http://localhost:1209/tag?'+getNewEntryParameters(tagHeader, tagData);
}

function passPaperParameter(){
  var paperData = [];
  for (var key in paperColumns) {
    //*
    if (paperColumns.hasOwnProperty(key)) {
      var parameterName = 'textarea#paper_'+key.replace("/","").toLowerCase();
      paperData.push($(parameterName).val());
    }
    //*/
  }

  var link = "window.location.href='http://localhost:1209/paper?"+getPaperParameters(paperColumns, paperData)+"'";
  console.log(link);
  window.location.href='http://localhost:1209/paper?'+getPaperParameters(paperColumns, paperData);
}
