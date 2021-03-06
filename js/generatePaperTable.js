function getProjectNameFromLink(){
  var element = window.location.href.split('?');
  if(element.length>1){
    var item = element[element.length -1].split('&');
    for(var i=0; i<item.length ; i++){
      var subItem = item[i].split('=');
      if(subItem[0] == 'proj')
        return subItem[1];
    }
  }
  return undefined;
}

var projectName = getProjectNameFromLink();

$(document).ready(function() {

  $.ajax({
     type: "GET",
     url: "metadata/"+projectName+"/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = parseText(csvData);
         labelDescription = generateLabel("Paper", csvDataText);
         labelPriorityMaps = getLabelPriorityMap("Paper",csvDataText);


         $.ajax({
            type: "GET",
            url: "metadata/"+projectName+"/tags.csv",
            dataType: "text",
            success: function(csvData) {
                tagArray = generateTagArray(parseText(csvData));
                $.ajax({
                   type: "GET",
                   url: "metadata/"+projectName+"/papers.csv",
                   dataType: "text",
                   success: function(csvData) {
                       document.getElementById("paperList").innerHTML = generateTable("paper", projectName, parseText(csvData),labelDescription);


                   $(".new_entry").hide();
                   $(".expandNewEntry").click(function () {
                       $(".new_entry").show("fast");
                   });

                   $("button").each(function( index ) {
                     if($(this).hasClass("rowSubmitButton"))
                      $(this).hide();
                    });

                   $('div[contenteditable=true]').focusin(function(){
                     $("#btn_"+this.id).show("fast");
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
                        //console.log($(this).attr('id')+"\t"+$(this).html());

                        passOneParameter(projectName, $(this));
                      }
                    });
                     }
                });
              }
         });

         generateNewEntryInterface(csvDataText); // from newEntryInterface.js
       }
});




});
