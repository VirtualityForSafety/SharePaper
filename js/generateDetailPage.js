const pdfDir = "resources/pdf/";

function getProjectNameFromLink(){
  var element = window.location.href.split('?');
  if(element.length>1){
    var item = element[element.length -1].split('&');
    for(var i=0; i<item.length ; i++){
      var subItem = item[i].split('=');
      if(subItem[0] == 'proj')
        return subItem[1];
    }
  }
  return undefined;
}

var projectName = getProjectNameFromLink();
$(document).ready(function() {
  $.ajax({
     type: "GET",
     //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     url: "metadata/"+projectName+"/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = parseText(csvData);
        paperColumns = generateLabel("Paper", csvDataText);
         tagColumns = generateLabel("Tag", csvDataText);
         tagHeader = getTagHeader(csvDataText);
         $.ajax({
            type: "GET",
            //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
            url: "metadata/"+projectName+"/tags.csv",
            dataType: "text",
            success: function(csvData) {
                tagArray = generateTagArray(parseText(csvData));

                $.ajax({
                   type: "GET",
                   //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
                   url: "metadata/"+projectName+"/papers.csv",
                   dataType: "text",
                   success: function(csvData) {
                     var paperID = getPaperIDFromLink();

                     if(paperID>=0)
                      paperArray = parseText(csvData);

                     document.getElementById("paperDetail").innerHTML = generatePaperPart(projectName, paperID, paperArray, paperColumns);
                    document.getElementById("tagDetail").innerHTML = generateTagPart(projectName, paperID, tagArray, tagColumns);
                     function resizeInput() {
                      $(this).attr('size', $(this).val().length);
                    }
                    $(".new_entry").hide();
                    $(".expandNewEntry").click(function () {
                        $(".new_entry").show("fast");
                    });

                    $("button").each(function( index ) {
                      if($(this).hasClass("rowSubmitButton"))
                       $(this).hide();
                     });

                    $('div[contenteditable=true]').focusin(function(){
                      $("#btn_"+this.id).show("fast");
                    });
                    $('div[contenteditable=true]').focusout(function(){
                      $("#btn_"+this.id).delay(1500).hide("fast");
                    });

                    $('div[contenteditable=true]').keydown(function(e) {
                       // trap the return key being pressed
                       if (e.keyCode == 13) {
                         // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
                         //document.execCommand('insertHTML', false, '<br><br>');
                         // prevent the default behaviour of return key pressed
                         //console.log($(this).attr('id')+"\t"+$(this).html());

                         partialUpdate(projectName, $(this));
                       }
                     });
                   }
                     });
                   }
            });
       }
});

});

function partialUpdate(projectName, element){
  element.blur();
  var label= ["id","label","value"];
  var queries = element.attr('id').split('_');
  var type= queries.shift()+'part';
  queries.push(element.html());
  var result = "";
  for(var i=0; i<label.length;i++)
    result += label[i]+"="+queries[i]+"&";
  window.location.href="http://localhost:4000/"+type+"?"+'proj='+projectName+'&'+result;
}

// returns a paperId, but a negative value for invalid link
function getPaperIDFromLink(){
  var element = window.location.href.split('?');
  if(element.length>1){
    var subElement = element[element.length -1].split('=');
    var id = subElement[subElement.length-1];
    return id;
  }
  return -1;
}

function getUUID(type, id, label){
  return type+"_"+id+"_"+label;
}

function getUpdateButton(projectName, type, id, label){
  return "<button id=btn_"+getUUID(type,id,label)+" class='rowSubmitButton' onclick=\"passOneParameter('"+projectName+"',"+getUUID(type,id,label)+")\">Update</button>";
}

function getWritableName (fileName){
  return fileName.replace(/[?#:]/g,'_');
}

function generatePaperPart(projectName, paperID, paperArray, paperColumns){
  var result = "<table id=\"paperTable\"><tr>";
  // for header
  var index =0;
  var headers = [];
  for (var key in paperColumns) {
    if (paperColumns.hasOwnProperty(key)) {
      headers.push(key+"");
      index += 1;
      if(index==1)
        result+= "<th style=\"display:none;\">"+ key + "</th>";
      else {
        result+= "<th><a class=\"tip\">"+ key + "<span class=\"description\">"+paperColumns[key]+"</span></a></th>";
      }
    }
  }

  var titleIndex = headers.indexOf("Title");
  console.log(pdfDir+getWritableName(paperArray[paperID][titleIndex])+".pdf");

  result += "</tr>";
  // for paper element
  if(paperArray[paperID]!=undefined)
  {
    result += "<tr>";
    for(var i=0; i<paperArray[paperID].length ; i++){
      //result +="<td><input type=\"text\" value=\""+ paperArray[paperID][i]+"\"></td>";
      var downloadLink = "";
      var label = headers[i].replace("/","").toLowerCase();
      if(i==paperArray[paperID].length-1)
        downloadLink = "<br><a href=\""+pdfDir+getWritableName(paperArray[paperID][titleIndex])+".pdf\" download>download</a>";
      if(i==0)
        result +="<div id="+getUUID("paper",paperID,label)+" style=\"display:none;\">"+paperArray[paperID][i]+"</div>" ;
      else
        result +="<td><div id="+getUUID("paper",paperID,label)+" contenteditable=\"true\">"+paperArray[paperID][i]+"</div>"+downloadLink+ "<br>" + getUpdateButton(projectName, "paper",paperID,label)+"</td>";
    }
    result += "</tr>";
  }
  return result + "</table>";
}

function generateTagPart(projectName, paperID, tagArray, tagColumns){
  var result = "<table id=\"tagTable\"><tr>";
  // for header
  var columnLength =0;
  var headers = [];
  for (var key in tagColumns) {
    if (tagColumns.hasOwnProperty(key)) {
      headers.push((key+"").replace(/ /g,"").replace("/","").toLowerCase());
      columnLength += 1;
      if(columnLength==1)
        result+= "<th style=\"display:none;\">"+ key + "</th>";
      else {
        result+= "<th><a class=\"tip\">"+ key + "<span class=\"description\">"+tagColumns[key]+"</span></a></th>";
      }
    }
  }
  result += "</tr>";

  var contributorIndex = headers.indexOf("contributor");
  var dateIndex = headers.indexOf("timestamp");
  var paperIDIndex = headers.indexOf("paperid");
  // for new entry
  result += "<tr class=\"new_entry\">";
  //*
  for(var k=0; k<columnLength-1; k++){
    var label = headers[k+1];
    if (k+1==contributorIndex)
      result +="<td><textarea id=\"new_tag_"+label+"\" cols=\"20\">"+getValueFromLS()+"</textarea></td>";
    else if(k+1==dateIndex)
      result +="<td><textarea style=\"display:none;\" id=\"new_tag_"+label+"\" cols=\"20\"></textarea></td>";
    else if(k+1==paperIDIndex)
      result +="<td><textarea id=\"new_tag_"+label+"\" cols=\"20\">"+paperID+"</textarea></td>";
    else
      result +="<td><textarea id=\"new_tag_"+label+"\" cols=\"20\"></textarea></td>";
  }
  //*/
  result += "</tr>";
  var submitButton = "<button onclick=\"passNewEntryParameter('"+projectName+"','tag')\">Submit</button>";
  result += "<tr class=\"new_entry\"><td style=\"text-align: center; vertical-align: middle;\" colspan='"+(headers.length-1)+"'>"+submitButton+"</td></tr>";

  // for tag elements
  if(tagArray[paperID]!=undefined)
  {
    for(var i=tagArray[paperID].length-1; i>=0; i--){
      result += "<tr>";
      var id = tagArray[paperID][i][0];
      for(var k=1; k<tagArray[paperID][i].length ; k++){
        var label = headers[k];
        result +="<td><div id="+getUUID("tag",id,label)+" contenteditable=\"true\">"+tagArray[paperID][i][k]+"</div><br>" + getUpdateButton(projectName, "tag",id,label)+"</td>";
      }
      result += "</tr>";
    }
  }
  return result + "</table>";
}
