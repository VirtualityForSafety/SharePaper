// from http://jsfiddle.net/mblase75/dcqxr/

$(document).ready(function() {
  $.ajax({
     type: "GET",
     //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     url: "metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = readCSV(csvData);
         labelDescription = generateLabel("Tag", csvDataText);
         labelPriorityMaps = getLabelPriorityMap("Tag",csvDataText);
       }
});
     $.ajax({
        type: "GET",
        //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
        url: "metadata/tags.csv",
        dataType: "text",
        success: function(csvData) {
            document.getElementById("tags").innerHTML = generateTagTable(readCSV(csvData));
            sortTable(5,1);
            reverseTableRows(1);

        $("tbody").tableDnD({
          onDragClass: "myDragClass"
         });

        }
     });

});
