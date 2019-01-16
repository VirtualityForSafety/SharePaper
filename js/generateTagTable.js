// from http://jsfiddle.net/mblase75/dcqxr/

$(document).ready(function() {
  $.ajax({
     type: "GET",
     url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
         columnDescription = generateTagColumn(readCSV(csvData));
       }
});
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
        dataType: "text",
        success: function(csvData) {
            document.getElementById("tags").innerHTML = generateTagTable(readCSV(csvData));
            sortTable(5,1);
            reverseTableRows(1);
        function copyText(value) {
          var copyText = document.getElementById(value);
          copyText.select();
          document.execCommand("copy");
          alert("Copied the text: " + copyText.value);
        }

        $("tbody").tableDnD({
          onDragClass: "myDragClass"
         });

        }
     });

});
