
$(document).ready(function() {

  $.ajax({
     type: "GET",
     url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = readCSV(csvData);
         labelDescription = generateLabel("Paper", csvDataText);
         labelPriorityMaps = getLabelPriorityMap("Paper",csvDataText);
         $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
            dataType: "text",
            success: function(csvData) {
                tagArray = generateTagArray(readCSV(csvData));
                $.ajax({
                   type: "GET",
                   url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
                   dataType: "text",
                   success: function(csvData) {
                       document.getElementById("paper").innerHTML = generatePaperTable(readCSV(csvData));
                       sortTable(8,2);
                       reverseTableRows(2);

                   $(".content").hide();
                   $(".clickable").click(function() {
                       $(this).nextUntil(".clickable").toggle("fast");
                   });
                   $(".expand").click(function () {
                       $(".content").show();
                   });
                   $(".collapse").click(function () {
                       $(".content").hide();
                   });
                   $(".new_entry").hide();
                   $(".expandNewEntry").click(function () {
                       $(".new_entry").show("fast");
                   });
                     }
                });
              }
         });
       }
});




});
