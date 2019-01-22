
$(document).ready(function() {

  $.ajax({
     type: "GET",
     //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     url: "metadata/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = parseText(csvData);
         labelDescription = generateLabel("Paper", csvDataText);
         labelPriorityMaps = getLabelPriorityMap("Paper",csvDataText);
         $.ajax({
            type: "GET",
            //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
            url: "metadata/tags.csv",
            dataType: "text",
            success: function(csvData) {
                tagArray = generateTagArray(parseText(csvData));
                $.ajax({
                   type: "GET",
                   //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
                   url: "metadata/papers.csv",
                   dataType: "text",
                   success: function(csvData) {
                       document.getElementById("paper").innerHTML = generatePaperTable(parseText(csvData),labelDescription);
                       //sortTable(8,1);
                       //reverseTableRows(1);


                   $(".new_entry").hide();
                   $(".expandNewEntry").click(function () {
                       $(".new_entry").show("fast");
                   });
                   $('div[contenteditable=true]').focusin(function(){
                     $(".btn_"+this.id).show("fast");
                   });
                   $('div[contenteditable=true]').focusout(function(){
                     $("#btn_"+this.id).delay(1500).hide("fast");
                   });
                   $('div[contenteditable=true]').keydown(function(e) {
                      // trap the return key being pressed
                      if (e.keyCode == 13) {
                        // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
                        //document.execCommand('insertHTML', false, '<br><br>');
                        // prevent the default behaviour of return key pressed
                        console.log($(this).attr('id')+"\t"+$(this).html());

                        var label= ["id","label","value"];
                        var queries = $(this).attr('id').split('_');
                        var type= queries.shift()+'part'; // remove type
                        queries.push($(this).html());
                        console.log(queries);
                        var result = "";
                        for(var i=0; i<label.length;i++)
                          result += label[i]+"="+queries[i]+"&";
                        window.location.href="http://localhost:1209/"+type+"?"+result;
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
