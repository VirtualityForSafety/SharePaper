// from http://jsfiddle.net/mblase75/dcqxr/
csv = "heading1,heading2,heading3,heading4,heading5\nvalue1_1,value2_1,value3_1,value4_1,value5_1\nvalue1_2,value2_2,value3_2,value4_2,value5_2",

function change1(obj){
    obj.style.background='blue';
    obj.style.color='white';
}
  function change2(obj){
    obj.style.background='white';
    obj.style.color='black';
}
  
function button1_click(){ 
    //document.getElementByClass("table").style.display="none";
    var ref = document.getElementsByClassName("table");
    for(var i=0;i<ref.length;i++){
      ref.item(i).style.display="none";
    }
    var k = document.getElementById("keyword").value;
    //var temp = $("#table > ul > li  > h2: contains('" + k + "')");
    var temp= (document.querySelectorAll("#paperName"));
    console.log(k);
  // var ex1="Robust my love";
  //  console.log(ex1.indexOf(k));
  for(var i=0; i<temp.length;i++){
    if((temp.item(i)).innerText.toLowerCase().indexOf(k.toLowerCase())>=0&&k!=""){
       console.log("TRUE");
       ref.item(i).style.display="block";
    }
     else{
       console.log("False");
     }
   }
}

$(document).ready(function() {
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
        dataType: "text",
        success: function(data) {
            document.getElementById("papers").innerHTML = processCSVData(data); prepareCollapsabile();}
     });
     $('.show_hide').click(function(){
        $(this).next('.slidingDiv').slideToggle();
         return false;
    });
});

function prepareCollapsabile(){
  
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

function processData(allText) {
  console.log(allText);
    var allTextLines = allText.split(',');
    var lines = [];
    var result = ""
    for (var i=0; i<allTextLines.length; i++) {
      var subresult = "<article class=\"strips__strip\"><div class=\"strip__content\">\n<h1 class=\"strip__title\" data-name=\"Ipsum\">\n";
      subresult += (allTextLines[i]);
      subresult += "</h1>      <div class=\"strip__inner-text\">        <h2>Ettrics</h2>        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia sapiente deserunt consectetur, quod reiciendis corrupti quo ea aliquid! Repellendus numquam quo, voluptate. Suscipit soluta omnis quibusdam facilis, illo voluptates odit!</p>        <p>          <a href=\"https://twitter.com/ettrics\" target=\"_blank\"><i class=\"fa fa-twitter\"></i></a>        </p>      </div>    </div></article>";
      result += subresult;
    }
    result += "<i class=\"fa fa-close strip__close\"></i>";
console.log(allTextLines);
  return result;
}

function processCSVData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    console.log(headers);
    var lines = [];
    var result = "";
    for (var i=1; i<allTextLines.length-1; i++) {
        var data = allTextLines[i].split(',');
        if(data.length != headers.length){
            var corrected_line = reparseLine(allTextLines[i]);
            data = corrected_line.split(',');
        }
        var subresult = "";
        subresult+= "<button class=\"collapsible\">" +data[1] + addTags(data[6]) + "</button>";
        subresult+= "<div class=\"content\"><p>updated at " + data[2]+" by " + data[3] + "</br>Note: " + data[5] + "</p></div>";
        result += subresult;
    }
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
    var string = "<ul class=\"tags\">";
    for(var i = 0; i < tags.length; i++){
        string += "<a href=\"#\" class=\"tag\">"
        string += tags[i];
        string += "</a>";
    }
    string += "</ul>";
    return string;
}
