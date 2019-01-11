// from http://jsfiddle.net/mblase75/dcqxr/

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

var tempAllTextLines;

$(document).ready(function() {
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/VirtualityForSafety/SharePaper/master/metadata/papers.csv",
        dataType: "text",
        success: function(data) {
            document.getElementById("papers").innerHTML = processCSVData(data); prepareCollapsible(); prepareCollapsibleTag(); tempAllTextLines = data.split(/\r\n|\n/);
          }
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
      var content = this.nextElementSibling.nextElementSibling;

      for(var j = 0; j < tempAllTextLines.length; j++){
        if(tempAllTextLines[j].indexOf(this.innerHTML) != -1) {
          var headers = tempAllTextLines[0].split(',');
          var data = tempAllTextLines[j].split(',');
            if(data.length != headers.length){
              var corrected_line = reparseLine(tempAllTextLines[j]);
              data = corrected_line.split(',');
            }
          break;
        }
      }
      
      var notes = parseNote(data[5]);
      var html = contentInnerHTML(data, notes[0]); // first note
      content.innerHTML = html;

      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }
}

function prepareCollapsibleTag(){
  var coll = document.getElementsByClassName("tag");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      //$(this).parent().css('color', 'red');
      
      this.classList.toggle("active");
      var content = this.parentElement.nextElementSibling; //find element by hierarchy
      var paperTitle = this.parentElement.previousElementSibling; 
      
      for(var j = 0; j < tempAllTextLines.length; j++){
        if(tempAllTextLines[j].indexOf(paperTitle.innerHTML) != -1) { //find the other data by paper title
          var headers = tempAllTextLines[0].split(',');
          var data = tempAllTextLines[j].split(',');
            if(data.length != headers.length){
              var corrected_line = reparseLine(tempAllTextLines[j]);
              data = corrected_line.split(',');
            }
          break;
        }
      }
      
      var notes = parseNote(data[5]);
      var html = contentInnerHTML(data, notes[$(this).index()+1]); // match note and tag with index
      content.innerHTML = html;
      
      console.log(content.innerHTML);
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
    var result = "";
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
    var unupdated = new Array;
    var updated = new Array;
    
    var result = "";
    var subresult = "";
    result = "<p id = \"new\">NEW!</p>"
    for (var i=1; i<allTextLines.length-1; i++) {
      var data = allTextLines[i].split(',');
      if(checkUpdated(data[2]) == 1){ // new paper
        updated.push(i);
      } else {
        unupdated.push(i);
      }
    }
    
    result += "<div class =\"newPaper\">";
    for (var j = 0; j<updated.length; j++) {
      subresult = "";
      var data = allTextLines[updated[j]].split(',');
      if(data.length != headers.length){
          var corrected_line = reparseLine(allTextLines[updated[j]]);
          data = corrected_line.split(',');
      }
      subresult+= "<button class=\"collapsible\">" + data[1] +"</button>" + addTags(data[6]) ;
      subresult+= "<div class=\"content\">";
      subresult+= contentInnerHTML(data, ":D NOTE :D")
      subresult += "</div>";
      result += subresult;
    }
    result += "</div>"

    
    for(i = 0; i < unupdated.length; i++){
      subresult = "";
      var data = allTextLines[unupdated[i]].split(',');
      if(data.length != headers.length){
          var corrected_line = reparseLine(allTextLines[unupdated[i]]);
          data = corrected_line.split(',');
      }
      subresult+= "<button class=\"collapsible\">" + data[1] +"</button>" + addTags(data[6]) ;
      subresult+= "<div class=\"content\">"; 
      subresult+= contentInnerHTML(data, ":D NOTE :D");
      subresult += "</div>";
      result += subresult;
    }
    return result;
}


function contentInnerHTML(data, note){
  var subresult= "";
  subresult += "<p class=\"detail\">updated at " + data[2]+" by " + data[3] + "</br>Note:";
  subresult += note;
  subresult += "</p><a href=\"resources/"+data[4]+".pdf\" download>download</a>";
  return subresult;
}

function checkUpdated(dateString){
  var time = dateString.split('/');
  var today = new Date();
  var paperDate = new Date(time[0], Number(time[1]) - 1, time[2]);
  var betweenDay = (today.getTime() - paperDate.getTime()) / 1000/60/60/24;

  if(betweenDay <= 12) return 1;
  else return 0;
}

function parseNote(note){
  var data = note.split('/');
  var notes = new Array;
  notes.push(data[0]);
  for(var i = 1; i < data.length; i++){
    var temp_notes = data[i].split(':');
    notes.push(temp_notes[1]);
  }
  return notes;
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
        string += "<p class=\"tag\">"
        string += tags[i];
        string += "</p>";
    }
    string += "</div>";
    return string;
}
