// from http://jsfiddle.net/mblase75/dcqxr/

$(document).ready(function() {
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
        dataType: "text",
        success: function(data) {
            document.getElementById("papers").innerHTML = processCSVData(data); }
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

function processCSVData(allText) {
  
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    
    var lines = [];
    var result = "<table id=\"paperTable\"><tr>";
    
    var header = allTextLines[0].split(',');
    for( var k=0; k<header.length ; k++){
      if(k==0){
          result+= "<th style=\"display:none;\">"+ header[k] + "</th>";
        }
        else{
          result+= "<th><button onclick=\"sortTable("+k+")\">"+ header[k] + "</button></th>";
          console.log("<th><button onclick=\"sortTable("+k+")\">"+ header[k] + "</button></th>");
          }
      }
    result += "</tr>";

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var dataLine = "<tr>";
        if(data.length != headers.length){
            var corrected_line = reparseLine(allTextLines[i]);
            data = corrected_line.split(',');
            for( var k=0; k<data.length ; k++){
              if(k==0){
                dataLine+= "<td style=\"display:none;\">"+ data[k] + "</td>";
                }
                else{
                  dataLine+= "<td>"+ data[k] + "</td>";
                  }
              }
              
        }
        result += dataLine + "</tr>";
    }

    return result + "</table>";
}

function reparseLine(oneLine){
    var data = oneLine.split('"');
    var start = oneLine.indexOf("\"");
    var end   = oneLine.indexOf("\"", start+1);
    var substring = oneLine.substring(start, end);

    var replaced_substring = substring.replace(/,/g," &");
    var new_string = data[0] + replaced_substring + data[2];
    return new_string;
}

