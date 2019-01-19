
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
                       sortTable(8,1);
                       reverseTableRows(1);

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
                   $('div[contenteditable=true]').focusin(function(){
                     console.log("!!");
                   });
                   $('div[contenteditable=true]').keydown(function(e) {
                      // trap the return key being pressed
                      if (e.keyCode == 13) {
                        // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
                        //document.execCommand('insertHTML', false, '<br><br>');
                        // prevent the default behaviour of return key pressed
                        console.log($(this).attr('class')+"\t"+$(this).html());
                        var label= ["type","id","value"];
                        var queries = $(this).attr('class').split(' ');
                        queries.push($(this).html());
                        console.log(queries);
                        var result = "";
                        for(var i=0; i<label.length;i++)
                          result += label[i]+"="+queries[i]+"&";
                        window.location.href="http://localhost:1209/paperpart?"+result;
                        $(this).blur();
                        return false;
                      }
                    });
                     }
                });
              }
         });
       }
});




});
