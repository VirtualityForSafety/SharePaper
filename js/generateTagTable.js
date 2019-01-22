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
     //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/columns.csv",
     url: "metadata/"+projectName+"/columns.csv",
     dataType: "text",
     success: function(csvData) {
       var csvDataText = parseText(csvData);
         labelDescription = generateLabel("Tag", csvDataText);
         labelPriorityMaps = getLabelPriorityMap("Tag",csvDataText);

         $.ajax({
            type: "GET",
            //url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/tags.csv",
            url: "metadata/"+projectName+"/tags.csv",
            dataType: "text",
            success: function(csvData) {
                document.getElementById("tags").innerHTML = generateTagTable(parseText(csvData), labelDescription);
                //sortTable(5,1);
                //reverseTableRows(1);

            $("tbody").tableDnD({
              onDragClass: "myDragClass"
             });
             $(".new_entry").hide();
             $(".expandNewEntry").click(function () {
                 $(".new_entry").show("fast");
             });

            }
         });
       }
});


});
