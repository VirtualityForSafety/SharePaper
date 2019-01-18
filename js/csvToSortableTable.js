//////////////////////////////////// common part ////////////////////////////////////

function reverseTableRows(interval) {

    var table = document.getElementById("paperTable"),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = table.rows,
        i = rows.length - 1;
        newTbody.appendChild(rows[0]);
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
    if(elements[i].length!=0 && elements[i]!="td" && !elements[i].includes("Section"))
      return String(elements[i]);
  }
}

function sortTable(numElement, interval) {
  var table, rows, switching, i, x, y, shouldSwitch;
  var check=1;
  table = document.getElementById("paperTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  if(columnState[numElement]==0){ //no sorted state

      while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - interval); i+=interval) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = getContentOnly(rows[i].getElementsByTagName("TD")[numElement]);
        y = getContentOnly(rows[i + interval].getElementsByTagName("TD")[numElement]);
        //check if the two rows should switch place:
/*
        var sortOrder={1 : 'high' , 2 : 'medium',3: 'low'};
        var tempx=0, tempy=0;
        // we can check x & y value

        if(x=='b'||y=='b');
        else{
          for(var j=0; j<3 ;j++){
            if(x==sortOrder[j+1]){
              tempx=j+1;
              forbreak+=1;
            }
            if(y==sortOrder[j+1]){
              tempy=j+1;
              forbreak+=1;
            }
            if(forbreak==2){
              check=0;
              break;
            }
          }
        }*/
        if(numElement==6)
          check=1;
        else
          check=0;
        if(compareWithContext(x,y,check)){
          shouldSwitch=true;
          break;
        }
        /*
        if (!check){
          if(tempx>tempy){
            shouldSwitch = true;
            // I can check shouldSwitch value has right value.
            break;
          }
        }
        else if (x.toLowerCase() > y.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          //console.log(shouldSwitch);
          break;
        }*/
        for(var t=0; t<columnState.length ; t++)
            columnState[t]=0;
        columnState[numElement]=1;
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
  }
  else if(columnState[numElement]>0){ //no sorted state
    reverseTableRows(interval);
  }
}
function compareWithContext(x,y,check){
  if(check){
    var sortOrder={'high':1 , 'medium':2,'low':3};
    // we can check x & y value
    /*if(!sortOrder[x.toLowerCase()]||!sortOrder[y.toLowerCase()]){
        return true;
    }
    else*/{
        return sortOrder[x.toLowerCase()]>sortOrder[y.toLowerCase()];
    }
  }
  else{
    return x.toLowerCase()>y.toLowerCase();
  }
}


function readCSV(allText){
  var allTextLines = allText.split(/\r\n|\n/);
  var data = new Array;
  for (var i = 0; i < allTextLines.length; i++) {
    if(allTextLines[i].length==0)
      continue;
    data[i] = parseLine(allTextLines[i]);
  }
  return data;
}


function parseLine(oneLine){
  var parsedData = [];
  var integrating = false;
    var data = oneLine.split(',');
    for (i=0; i<data.length; i++){
      if(!integrating)
        item = data[i];
      else {
        //item += "," + data[i];
        if(!data[i].includes('\"')) item += "," + data[i];
      }
      //if ((data[i].match(/'\"'/g) || []).length>0){
      if(data[i].includes('\"')){
        splited = data[i].split('\"');
        if(!integrating)
          item = (splited[0].length > splited[1].length)? splited[0] : splited[1];
        else
          item += (splited[0].length > splited[1].length)? ", "+splited[0] : splited[1];
        integrating = !integrating;
      }
      if(!integrating)
        parsedData.push(item);
    }
    return parsedData;
}

function checkUpdated(dateString){
  var time = dateString.split('/');
  var today = new Date();
  var paperDate = new Date(time[0], Number(time[1]) - 1, time[2]);
  var betweenDay = (today.getTime() - paperDate.getTime()) / 1000/60/60/24;

  if(betweenDay <= 12) return 1;
  else return 0;
}

//////////////////////////////////// paper part ////////////////////////////////////

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
      result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+",2)\">"+ header[k] + "<span class=\"description\">"+columnDescription[header[k]]+"</span></button></th>";
    }
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
        if(k==titleIndex)
          dataLine += "<td "+"><div id=\"paper"+(id)+"\" class=\"Section\">"+ data[i][k] + "</div></td>"; // for anchoring
        else if(k==data[i].length-1)
          dataLine += "<td "+"><a href=\"paper.html?id="+(_paperID+"")+"\">link</a></td>";
        else
          dataLine+= "<td "+">"+ data[i][k] + "</td>";
      }
    }
    result += dataLine + "</tr>";
    // paper detail information
    result += getPaperDetail(i, header.length-1);
  }
  /*
  // for new entry
  result += "<tr class=\"new_entry\">";
  //*
  for(var k=0; k<header.length-1; k++){
    if(k==header-2){
      //var hiddenItem = "<textarea id=\"new_tag_"+keys[k+1].toLowerCase()+"\" cols=\"20\" style=\"display:none;\"></textarea>";
      hiddenItem = "";
      result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
    }
    else{
        result +="<td><textarea id=\"new_paper_"+header[k+1].replace("/","").toLowerCase()+"\" cols=\"20\"></textarea></td>";
    }
  }
  result += "</tr>";

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
          result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+",1)\">"+ header[k] + "<span class=\"description\">"+columnDescription[header[k]]+"</span></button></th>";
          }
      }
    result += "</tr>";

    for (var i=1; i<data.length; i++) {
      var dataLine = "<tr>";
        var dataRow = data[i];
        var shouldHighlighted = checkUpdated(dataRow[dateIndex]);
        var id=i;
        for( var k=0; k<dataRow.length ; k++){
          if(shouldHighlighted){
            dataRow[k] = "<b>"+dataRow[k]+"</b>";
          }

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
