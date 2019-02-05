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
         labelDescription = generateLabel("Tag", csvDataText);
         labelPriorityMaps = getLabelPriorityMap("Tag",csvDataText);
         
         $.ajax({
            type: "GET",
            url: "metadata/"+projectName+"/tags.csv",
            dataType: "text",
            success: function(csvData) {
                document.getElementById("tagList").innerHTML = generateTable("tag", projectName, parseText(csvData), labelDescription);

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
