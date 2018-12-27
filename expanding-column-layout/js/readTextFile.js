// from http://jsfiddle.net/mblase75/dcqxr/
csv = "heading1,heading2,heading3,heading4,heading5\nvalue1_1,value2_1,value3_1,value4_1,value5_1\nvalue1_2,value2_2,value3_2,value4_2,value5_2",


$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "tag7.txt",
        dataType: "text",
        success: function(data) {document.getElementById("demo").innerHTML = processData(data);}
     });
});

function processData(allText) {
  console.log(allText);
    var allTextLines = allText.split(',');
    /*
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    */
console.log(allTextLines);
  return allTextLines;
}

/*
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:4000/expanding-column-layout/tag7.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
console.log(lines);
}*/
