
$(document).ready(function() {
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
        dataType: "text",
        success: function(csvData) {
            columnDescription = generatePaperColumn(readCSV(csvData));
            console.log(columnDescription);
            document.getElementById("paper").innerHTML = generatePaperTable(readCSV(csvData)); }
     });
     $('.show_hide').click(function(){
        $(this).next('.slidingDiv').slideToggle();
         return false;
    });
});
