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
        url: "metadata/"+projectName+"/papers.csv",
        dataType: "text",
        success: function(data) {
            document.getElementById("checkTag").innerHTML = processCSVData(data); }//prepareCollapsible();}
     });
$('.show_hide').click(function(){
        $(this).next('.slidingDiv').slideToggle();
         return false;
    });
});

function prepareCollapsible(){

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
}

function processCSVData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var first = allTextLines[1].split(',');

    var lines = [];
    var result = "";
    var names = new Array;

    for (var i=1; i<allTextLines.length-1; i++) {
        var data = allTextLines[i].split(',');

        if(data.length != headers.length){
            var corrected_line = reparseLine(allTextLines[i]);
            data = corrected_line.split(',');
        }

        var subresult = "";
        var tags = data[5].split('/');

        for(var k= 0; k < tags.length; k++){
            names.push(tags[k]);
        }

        var uniq = names.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
        },[]);

    }
    if(uniq==undefined)
      return result;
    for(var k=0; k<uniq.length; k++){

        subresult+= "<button class=\"tag\" onclick=\"toggle_by_class('_"+uniq[k].replace(" ","_")+"')\">" + uniq[k] + "</button>";
    }

    result += subresult;

    return result;

}


function reparseLine(oneLine){
    var data = oneLine.split('"');
    var start = oneLine.indexOf("\"");
    var end   = oneLine.indexOf("\"", start+1);
    var substring = oneLine.substring(start, end);

    var replaced_substring = substring.replace(/,/g," &");
    var new_string = data[0] + replaced_substring + data[2];
    return new_string;
}

function addTags(tagSentence){
    var tags = tagSentence.split('/');
    var string = "<div class=\"alignright\">";
    for(var i = 0; i < tags.length; i++){
        string += "<a href=\"#\" class=\"tag\">"
        string += tags[i];
        string += "</a>";
    }
    string += "</div>";
    return string;
}
