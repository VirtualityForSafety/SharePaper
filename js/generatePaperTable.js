
$(document).ready(function() {
  $.ajax({
     type: "GET",
     url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
         columnDescription = generatePaperColumn(readCSV(csvData));
       }
});

$.ajax({
   type: "GET",
   url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
   dataType: "text",
   success: function(csvData) {
       tagArray = generateTagArray(readCSV(csvData));
     }
});
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
        dataType: "text",
        success: function(csvData) {
            document.getElementById("paper").innerHTML = generatePaperTable(readCSV(csvData));
            $(".content").hide();
            $(".clickable").click(function() {
            $(this).nextUntil(".clickable").toggle("fast");
        });
          }
     });

});
