//////////////////////////////////// common part ////////////////////////////////////

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function reverseTableRows(interval) {

    var table = document.getElementById("paperTable"),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = table.rows,
        i = rows.length - 1;
        newTbody.appendChild(rows[0]); // header
        newTbody.appendChild(rows[0]); // new_entry
        for (i = rows.length-interval; i >= 0; i-=interval) {

          //console.log(rows[i+1]);
          newTbody.appendChild(rows[i]);
          if(interval==2)
            newTbody.appendChild(rows[rows.length-1]);
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

function sortTable(numElement, interval, priorityMap) {
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
      for (i = 1; i < (rows.length - interval); i+=interval) {
        if(hasClass(rows[i],"new_entry"))
          continue;
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = getContentOnly(rows[i].getElementsByTagName("TD")[numElement]);
        y = getContentOnly(rows[i + interval].getElementsByTagName("TD")[numElement]);
        //check if the two rows should switch place:
        if(compareWithContext(x.toLowerCase(),y.toLowerCase(),priorityMap)){
          shouldSwitch=true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + interval], rows[i]);
        if(interval==2)
          rows[i].parentNode.insertBefore(rows[i + 3], rows[i+1]);
        switching = true;
      }
    }
    invalidateSortingState();

    sortingState[numElement]=1;
  }
  else if(sortingState[numElement]>0){ //no sorted state
    reverseTableRows(interval);
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

//////////////////////////////////// paper part ////////////////////////////////////

function getNewEntryParameters(paperHeader, id,item){
  var result ="";
  for (var i=0 ; i<paperHeader.length ; i++) {
    if(i==0){
        result+= paperHeader[i].replace(/ /g,"").toLowerCase() + "=" + id+"&";
      continue;
    }
    else{
        result+= paperHeader[i].replace(/ /g,"").toLowerCase() + "=" + item[i-1]+"&";
    }
  }
  return result;
}

function passNewPaperEntryParameter(){
  var paperHeader = [];
  for (var key in paperColumns) {
    if (paperColumns.hasOwnProperty(key)) {
      var parameterName = 'textarea#new_paper_'+key.replace(" ","").toLowerCase();
      paperHeader.push($(parameterName).val());
    }
  }
  window.location.href='http://localhost:1209/paper?'+getNewEntryParameters(paperHeader, 99999, newItemArray);
}

function generatePaperTable(data) {
  //var result = "<table id=\"test\"><tbody><tr class=\"clickable\"><td>Paper info</td><td>Paper info</td><td>Paper info</td></tr><tr class=\"content\"><td colspan=3>Paper detail</td></tr></tbody></table><table id=\"paperTable\"><tr>";
  var result = "<table id=\"paperTable\"><tr>";
  var header = data[0];
  var titleIndex = header.indexOf("Title");
  var dateIndex = header.indexOf("Timestamp");
  for( var k=0; k<header.length ; k++){
    if(k==0){
        result+= "<th style=\"display:none;\">"+ header[k] + "</th>";
    }
    else{
      result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+",1)\">"+ header[k] + "<span class=\"description\">"+labelDescription[header[k]]+"</span></button></th>";
    }
  }
  result += "</tr>";

  // for new entry
  result += "<tr class=\"new_entry\">";
  //*
  for(var k=0; k<header.length-1; k++){
    var submitButton = "<button onclick=\"passNewEntryParameter(99999)\">Submit</button>";
    result +="<td><textarea id=\"new_paper_"+header[k+1].replace("/","").toLowerCase()+"\" cols=\"20\"></textarea><br>"+submitButton+"</td>";
    // result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
  }
  result += "</tr>";

  var _paperID = -1;
  for (var i=1; i<data.length; i++) {
    var dataLine = "<tr class=\"clickable\">";
    var shouldHighlighted = false;
    if(dateIndex >=0){
      shouldHighlighted = checkUpdated(data[i][dateIndex]);
    }
    var id = i;
    for(var k=0; k<data[i].length ; k++){
      if(k==0){
        _paperID = data[i][k];
        dataLine+= "<td style=\"display:none;\">"+ data[i][k] + "</td>";
      }
      else{
        var highLightStyle = "";
        if(shouldHighlighted)
          highLightStyle ="class='highlight'";
        if(k==data[i].length-1)
          dataLine += "<td "+"><a href=\"paper.html?id="+(_paperID+"")+"\">link</a></td>";
        else
          dataLine+= "<td "+"><div id=\""+(data[0][k]).replace("/","").toLowerCase()+"_"+id+"\" contenteditable=\"true\">"+ data[i][k] + "</div></td>";
      }
    }
    result += dataLine + "</tr>";
    // DEPRECATED: paper detail information
    //result += getPaperDetail(i, header.length-1);
  }
  //*/
  return result + "</table>";
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
  tagMap = new Array(getMaxPaperID(data)+1);
  for (var i=1; i<data.length; i++) {
    var paperID = data[i][data[i].length-1];
    if(tagMap[paperID]!=undefined){
      tagMap[paperID].push(data[i]);
    }
    else{
      var tempArray = new Array();
      tempArray.push(data[i]);
      tagMap[paperID] = tempArray;
    }
  }
  return tagMap;
}

function generateTagTable(data) {
    var result = "<table id=\"paperTable\"><tr class=\"nodrop nodrag\">";
    var header = data[0];
    var dateIndex = header.indexOf("Timestamp");
    var commentIndex = header.indexOf("Comment");
    for( var k=0; k<header.length ; k++){
      if(k==0){
          result+= "<th style=\"display:none;\">"+ header[k] + "</th>";
        }
        else{
          result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+",1)\">"+ header[k] + "<span class=\"description\">"+labelDescription[header[k]]+"</span></button></th>";
          }
      }
    result += "</tr>";

    // for new entry
    result += "<tr class=\"new_entry\">";
    //*
    for(var k=0; k<header.length-1; k++){
      var submitButton = "<button onclick=\"passNewEntryParameter(99999)\">Submit</button>";
      result +="<td><textarea id=\"new_tag_"+header[k+1].replace("/","").toLowerCase()+"\" cols=\"20\"></textarea><br>"+submitButton+"</td>";
      // result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
    }
    result += "</tr>";

    for (var i=1; i<data.length; i++) {
      var dataLine = "<tr>";
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
                dataLine += "<td><a href=\"paper.html?id="+dataRow[k]+"\">link</a></td>";
              else
                dataLine+= "<td>"+ dataRow[k] + "</td>";
              }
          }

        result += dataLine + "</tr>";
    }

    return result + "</table>";
}
