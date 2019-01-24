$(document).ready(function() {
    $.ajax({
       type: "GET",
       url: "metadata/proj.csv",
       dataType: "text",
       success: function(csvData) {
           document.getElementById("projectList").innerHTML = getProject(csvData); }
    });
});

function getRawText(data){
  return data.replace(" ","").replace("/","").toLowerCase();
}

function getProject(csvData){
  var result ="<table width=90%>";
  var data = parseText(csvData);
  for(var i=1 ; i<data.length ; i++){
    result += "<tr><td><div OnClick=\"location.href='share.html?proj="+getRawText(data[i][1])+"'\"><h3>"+data[i][1]+"</h3>"+data[i][2]+"</td></div></tr>";
  }
  result += "<tr><td><center><div onclick=\"openForm()\"><h2>+</h2></center></td></div></tr>";
  result += "</table>";
  return result;
}
