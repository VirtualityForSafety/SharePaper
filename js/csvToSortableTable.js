// from http://jsfiddle.net/mblase75/dcqxr/

$(document).ready(function() {
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
        dataType: "text",
        success: function(data) {
            document.getElementById("papers").innerHTML = csvToPaperColumn(readCSV(data)); }
     });
     $('.show_hide').click(function(){
        $(this).next('.slidingDiv').slideToggle();
         return false;
    });
});

function reverseTableRows() {

    var table = document.getElementById("paperTable"),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = table.rows,
        i = rows.length - 1;
        newTbody.appendChild(rows[0]);
        for (i = rows.length - 1; i >= 0; i--) {
            newTbody.appendChild(rows[i]);
        }
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
}

function sortTable(numElement) {
  var table, rows, switching, i, x, y, shouldSwitch;
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
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[numElement];
        y = rows[i + 1].getElementsByTagName("TD")[numElement];
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
        columnState[numElement]=1;

      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
  else if(columnState[numElement]>0){ //no sorted state
    reverseTableRows();
  }
}

function readCSV(allText){
  var allTextLines = allText.split(/\r\n|\n/);
  var data = new Array;
  var header = allTextLines[0].split(',');
  data[0] = header;

  for (var i = 1; i < allTextLines.length; i++) {
    if(allTextLines[i].length==0)
      continue;
    data[i] = parseLine(allTextLines[i]);
    console.log(data[i]);
  }
  return data;
}

function csvToPaperColumn(data) {
  var result = "<table id=\"paperTable\"><tr>";
  var header = data[0];
  var titleIndex = header.indexOf("Title");
  var dateIndex = header.indexOf("Timestamp");
  for( var k=0; k<header.length ; k++){
    if(k==0){
        result+= "<th style=\"display:none;\">"+ header[k] + "</th>";
    }
    else{
      result+= "<th><button class=\"tip\" onclick=\"sortTable("+k+")\">"+ header[k] + "<span class=\"description\">"+columnDescription[header[k]]+"</span></button></th>";
    }
  }
  result += "</tr>";

  for (var i=1; i<data.length; i++) {
    console.log(i);
    console.log(data.length);
    console.log(data[i].length);
    var dataLine = "<tr>";
    var shouldHighlighted = false;
    if(dateIndex >=0)
      checkUpdated(data[i][dateIndex]);
    var id = i;
    for(var k=0; k<data[i].length ; k++){
      if(shouldHighlighted){
        data[i][k] = "<b>"+data[i][k]+"</b>";
      }
      if(k==0){
        dataLine+= "<td style=\"display:none;\">"+ data[i][k] + "</td>";
      }
      else{
        if(k==titleIndex)
          dataLine += "<td><div id=\"paper"+(id)+"\" class=\"Section\">"+ data[i][k] + "</div></td>";
        else if(k==data[i].length-1)
          dataLine += "<td><a href=\"resources/"+data[i][k]+".pdf\" download>download</a></td>";
        else
          dataLine+= "<td>"+ data[i][k] + "</td>";
      }
    }
    result += dataLine + "</tr>";
  }
  return result + "</table>";
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

function checkUpdated(dateString){
  var time = dateString.split('/');
  var today = new Date();
  var paperDate = new Date(time[0], Number(time[1]) - 1, time[2]);
  var betweenDay = (today.getTime() - paperDate.getTime()) / 1000/60/60/24;

  if(betweenDay <= 12) return 1;
  else return 0;
}
