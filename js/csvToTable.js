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

function processCSVData(allText) {
  
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    console.log(headers);
    
    var lines = [];
    var result = "<table id=\"paperTable\"><tr>";
    
    var header = allTextLines[0].split(',');
    for( var k=0; k<header.length ; k++)
      result+= "<th>"+ header[k] + "</th>";
    result += "</tr>";

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var dataLine = "<tr>";
        if(data.length != headers.length){
            var corrected_line = reparseLine(allTextLines[i]);
            data = corrected_line.split(',');
            for( var k=0; k<data.length ; k++)
              dataLine+= "<td>"+ data[k] + "</td>";
              
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

