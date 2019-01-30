$(document).ready(function() {
  document.getElementById("newEntryInterface").innerHTML = generateNewEntry();
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("newEntryBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

function generateNewEntry(){
  var result = "<button id=\"newEntryBtn\" >+</button>";
  result += "<div id=\"myModal\" class=\"modal\">";
  result += "<div class=\"modal-content\">";
  result += "<span class=\"close\">&times;</span>";
  result += generateNewEntryCore();
  result += "</div></div>";
  return result;
}

function generateNewEntryCore(){
  //var result += "<p>Some text in the Modal..</p>";
  // for new entry
  var result = "<p >";
  //*
  headers = ['id','title', 'year', 'journalconference', 'author', 'keyword', 'quality', 'summary', 'timestamp', 'contributor', 'link'];
  for(var k=0; k<headers.length-1; k++){
    var textValue="";
    if(k+1==9)
      result +="<textarea id=\"new_paper_"+headers[k+1]+"\" cols=\"20\">"+getValueFromLS()+"</textarea></br>";
    else if(k+1==8)
      result +="<textarea style=\"display:none;\" id=\"new_paper_"+headers[k+1]+"\" cols=\"20\"></textarea>";
    else if(k+1==10)
      result +=""+createPopup()+"";
    else
      result +="<textarea id=\"new_paper_"+headers[k+1]+"\" cols=\"20\">"+textValue+"</textarea></br>";

    // result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
  }
  result += "</p>";
  return result;
}
