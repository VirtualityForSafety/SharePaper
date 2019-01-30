//////////////////////////////////// common part ////////////////////////////////////

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function reverseTableRows(skipInterval) {

    var table = document.getElementById("paperTable"),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = table.rows,
        i = rows.length - 1;
        for(var i=0; i<skipInterval ; i++){
          newTbody.appendChild(rows[0]); // header
        }
        for (i = rows.length-1; i >= 0; i-=1) {

          //console.log(rows[i+1]);
          newTbody.appendChild(rows[i]);
        }
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
}

function getContentOnly(data){
  var elements = String(data.outerHTML).split(/<|>/);
  for(var i=0; i<elements.length ; i++){
    if(elements[i].length!=0 && elements[i]!="td" && !elements[i].includes("Section") && !elements[i].includes("contenteditable") && !elements[i].includes("class="))
      return String(elements[i]);
  }
}

function invalidateSortingState(){
  for(var t=0; t<sortingState.length ; t++)
      sortingState[t]=0;
}

function sortTable(numElement, skipInterval, priorityMap) {
  var priorityMap = labelPriorityMaps[numElement];
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("paperTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  if(sortingState[numElement]==0){ //no sorted state

      while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = skipInterval; i < (rows.length - 1); i+=1) {
        if(hasClass(rows[i],"new_entry"))
          continue;
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = getContentOnly(rows[i].getElementsByTagName("TD")[numElement]);
        y = getContentOnly(rows[i + 1].getElementsByTagName("TD")[numElement]);
        //check if the two rows should switch place:
        if(compareWithContext(x.toLowerCase(),y.toLowerCase(),priorityMap)){
          shouldSwitch=true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
    invalidateSortingState();

    sortingState[numElement]=1;
  }
  else if(sortingState[numElement]>0){ //no sorted state
    reverseTableRows(skipInterval);
  }

}

function compareWithContext(x,y,priorityMap){
  if(priorityMap.size>0){
    var xValue = priorityMap.get(x);
    var yValue = priorityMap.get(y);
    return (xValue==undefined?9999:xValue)>(yValue==undefined?9999:yValue);
  }
  else
    return x > y;
}

function checkUpdated(dateString){

  if(dateString==undefined)
    return 0;
  var time = dateString.split('/');
  var today = new Date();
  var paperDate = new Date(time[0], Number(time[1]) - 1, time[2]);
  var betweenDay = (today.getTime() - paperDate.getTime()) / 1000/60/60/24;

  if(betweenDay <= 12) return 1;
  else return 0;
}

function getUUID(type, id, label){
  return type+"_"+id+"_"+label;
}

function getUpdateButton(projectName, type, id, label){
  return "<button id=btn_"+getUUID(type,id,label)+" class='rowSubmitButton' onclick=\"passOneParameter('"+projectName+"',"+getUUID(type,id,label)+")\">Update</button>";
}

function createPopup(){
  return "<a href=\"#\" onClick=\"passTitle(); return false;\">Upload</a><noscript>You need Javascript to use the previous link or use <a href=\"index.html\" target=\"_blank\">Upload</a></noscript>";
}

function generatePaperTable(projectName, data, labels) {
  //var result = "<table id=\"test\"><tbody><tr class=\"clickable\"><td>Paper info</td><td>Paper info</td><td>Paper info</td></tr><tr class=\"content\"><td colspan=3>Paper detail</td></tr></tbody></table><table id=\"paperTable\"><tr>";
  var result = "<table id=\"paperTable\"><tr>";
  var headers = [];
  for(var i=0; i<data[0].length ; i++)
    headers.push((data[0][i]+"").replace(/ /g,"").replace("/","").toLowerCase());
  var titleIndex = headers.indexOf("title");
  var dateIndex = headers.indexOf("timestamp");
  var linkIndex = headers.indexOf("link");
  var contributorIndex = headers.indexOf("contributor");
  var linkIndex = headers.indexOf('link');

  for( var k=0; k<data[0].length ; k++){
    if(k==0){
        result+= "<th style=\"display:none;\">"+ data[0][k] + "</th>";
    }
    else{
      result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+",3)\">"+ data[0][k] + "<span class=\"description\">"+labelDescription[data[0][k]]+"</span></button></th>";
    }
  }
  result += "</tr>";

  // for new entry
  result += "<tr class=\"new_entry\">";
  //*
  for(var k=0; k<headers.length-1; k++){
    var textValue="";
    if(k+1==contributorIndex)
      result +="<td><textarea id=\"new_paper_"+headers[k+1]+"\" cols=\"20\">"+getValueFromLS()+"</textarea></td>";
    else if(k+1==dateIndex)
      result +="<td><textarea style=\"display:none;\" id=\"new_paper_"+headers[k+1]+"\" cols=\"20\"></textarea></td>";
    else if(k+1==linkIndex)
      result +="<td>"+createPopup()+"</td>";
    else
      result +="<td><textarea id=\"new_paper_"+headers[k+1]+"\" cols=\"20\">"+textValue+"</textarea></td>";

    // result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
  }
  result += "</tr>";
  var submitButton = "<button id=\"submit_\" onclick=\"passNewEntryParameter('"+projectName+"','paper')\">Submit</button>";

  result += "<tr class=\"new_entry\"><td style=\"text-align: center; vertical-align: middle;\" colspan='"+(headers.length-1)+"'>"+submitButton+"</td></tr>";

  var _paperID = -1;
  for (var i=data.length-1; i>=1; i--) {
    var tags = getPaperTags(i);
    var dataLine = "<tr class=\"clickable _tag "+tags+"\">";
    var shouldHighlighted = false;
    if(dateIndex >=0){
      shouldHighlighted = checkUpdated(data[i][dateIndex]);
    }
    var id = i;
    for(var k=0; k<data[i].length ; k++){

      var label = headers[k];
      if(k==0){
        _paperID = data[i][k];
        dataLine+= "<td style=\"display:none;\">"+ data[i][k] + "</td>";
      }
      else{
        var highLightStyle = "";
        if(shouldHighlighted)
          highLightStyle ="class='highlight'";
        if(k==data[i].length-1)
          dataLine += "<td "+"><a href=\"detail.html?proj="+projectName+"&id="+(_paperID+"")+"\">link</a></td>";
        else
        {
          if(label =='timestamp') {
            dataLine+= "<td "+"><div id="+getUUID("paper",_paperID,label)+" contenteditable=\"true\">"+ convertUTCDateToLocalDate(data[i][k]) + "</div><br>" + getUpdateButton(projectName, "paper",id,label)+"</td>";
          }
          else dataLine+= "<td "+"><div id="+getUUID("paper",_paperID,label)+" contenteditable=\"true\">"+ data[i][k] + "</div><br>" + getUpdateButton(projectName, "paper",id,label)+"</td>";
        }

      }
    }
    result += dataLine + "</tr>";
    // DEPRECATED: paper detail information
    //result += getPaperDetail(i, header.length-1);
  }
  //*/
  return result + "</table>";
}

function zeroPad(nr,base){
  var  len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

function convertUTCDateToLocalDate(string) {
  var timestamp = string.split('/');
  var date = new Date(Date.UTC(Number(timestamp[0]), Number(timestamp[1]-1), Number(timestamp[2]),
    Number(timestamp[3]), Number(timestamp[4]), Number(timestamp[5])));
  var datevalues = [
    zeroPad(date.getFullYear(),1000),
    zeroPad(date.getMonth()+1,10),
    zeroPad(date.getDate(),10),
    zeroPad(date.getHours(),10),
    zeroPad(date.getMinutes(),10),
    zeroPad(date.getSeconds(),10)
  ];
  return datevalues.join('/');
}

function fileup(){
  console.log("File upload");
}

function getPaperTags(index){
  var paperDetail = "";
  if(tagArray[index]!=undefined && tagArray[index].length!=undefined){
    for(var k=0; k<tagArray[index].length ; k++){
      // should be refined
      paperDetail += "_"+tagArray[index][k][3].replace(" ","_") + " ";
    }
  }
  return paperDetail;
}

function getPaperDetail(index, columnLength){

  var paperTagInfo="";
  var paperDetail = "";
  if(tagArray[index]!=undefined && tagArray[index].length!=undefined){
    for(var k=0; k<tagArray[index].length ; k++){
      // should be refined
      paperDetail += "<b>["+tagArray[index][k][1] + "]\t";
      paperDetail += "["+tagArray[index][k][3] + "]</b><br>";
      paperDetail += tagArray[index][k][2] + " - by " + tagArray[index][k][4]+", " + tagArray[index][k][5]+"<br>";
    }
  }
  paperTagInfo += "<tr class=\"content\"><td colspan="+columnLength+">"+paperDetail+"</td></tr>";
  return paperTagInfo;
}

//////////////////////////////////// tag part ////////////////////////////////////

function getMaxPaperID(data){
  var maxID = 0;
  for (var i=1; i<data.length; i++) {
    var paperID = data[i][data[i].length-1] * 1;
    if(paperID > maxID)
      maxID = paperID;
  }
  return maxID;
}

function generateTagArray(data) {
  tagArray = new Array(getMaxPaperID(data)+1);
  for (var i=1; i<data.length; i++) {
    var paperID = data[i][data[i].length-1];
    if(tagArray[paperID]!=undefined){
      tagArray[paperID].push(data[i]);
    }
    else{
      var tempArray = new Array();
      tempArray.push(data[i]);
      tagArray[paperID] = tempArray;
    }
  }
  return tagArray;
}

function generateTagTable(projectName, data, labels) {
    var result = "<table id=\"paperTable\"><tr class=\"nodrop nodrag\">";

    var headers = [];
    for(var i=0; i<data[0].length ; i++)
      headers.push((data[0][i]+"").replace(/ /g,"").replace("/","").toLowerCase());
    var dateIndex = headers.indexOf("timestamp");
    var commentIndex = headers.indexOf("comment");
    var tagIndex = headers.indexOf("tag");
    var contributorIndex = headers.indexOf("contributor");
    for( var k=0; k<data[0].length ; k++){
      if(k==0){
          result+= "<th style=\"display:none;\">"+ data[0][k] + "</th>";
        }
        else{
          result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+",3)\">"+ data[0][k] + "<span class=\"description\">"+labelDescription[data[0][k]]+"</span></button></th>";
          }
      }

    result += "</tr>";

    // for new entry
    result += "<tr class=\"new_entry\">";
    //*
    for(var k=0; k<headers.length-1; k++){
      if(k+1==dateIndex)
        result +="<td><textarea style=\"display:none;\" id=\"new_tag_"+headers[k+1]+"\" cols=\"20\"></textarea></td>";
      else if(k+1==contributorIndex)
        result +="<td><textarea id=\"new_tag_"+headers[k+1]+"\" cols=\"20\">"+getValueFromLS()+"</textarea></td>";
      else
        result +="<td><textarea id=\"new_tag_"+headers[k+1]+"\" cols=\"20\"></textarea></td>";
      // result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
    }
    result += "</tr>";
    var submitButton = "<button onclick=\"passNewEntryParameter('"+projectName+"','tag')\">Submit</button>";
    result += "<tr class=\"new_entry\"><td style=\"text-align: center; vertical-align: middle;\" colspan='"+(headers.length-1)+"'>"+submitButton+"</td></tr>";

    for (var i=data.length-1; i>=1; i--) {
      var tagName = ("_"+data[i][tagIndex]).replace(" ","_");
      var dataLine = "<tr class=\"_tag "+tagName+"\">";
        var dataRow = data[i];
        var shouldHighlighted = checkUpdated(dataRow[dateIndex]);
        var id=i;
        for( var k=0; k<dataRow.length ; k++){
          var highLightStyle = "";
          if(shouldHighlighted)
            highLightStyle ="class='highlight'";

          if(k==0){
            id = dataRow[k];
            dataLine+= "<td style=\"display:none;\">"+ dataRow[k] + "</td>";
            }
            else{
              if(k==commentIndex){
                //dataLine+= "<td><input type=\"hidden\" value=\""+dataRow[k]+"\" id=\"tag"+ i +"\">"; // set hidden input value
                dataLine+= "<td><a onclick = \"setClipboard('"+ dataRow[k]+"')\">"; // set link
                dataLine+= dataRow[k] + "</a></td>";
              }
              else if(k==dataRow.length-1)
                dataLine += "<td><a href=\"detail.html?proj="+projectName+"&id="+dataRow[k]+"\">link</a></td>";
              else
                dataLine+= "<td>"+ dataRow[k] + "</td>";
              }
          }

        result += dataLine + "</tr>";
    }

    return result + "</table>";
}
