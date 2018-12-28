// from http://jsfiddle.net/mblase75/dcqxr/
csv = "heading1,heading2,heading3,heading4,heading5\nvalue1_1,value2_1,value3_1,value4_1,value5_1\nvalue1_2,value2_2,value3_2,value4_2,value5_2",


$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "tag5.txt",
        dataType: "text",
        success: function(data) {document.getElementById("demo").innerHTML = processData(data); Expand.init();}
     });
});

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
