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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function drawConfirmCircle(color) {
    var canvas = document.getElementById("imgCanvas");
    var context = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var posx = e.clientX - rect.left;
    var posy = e.clientY - rect.top;

    context.fillStyle = color;
    context.beginPath();
    context.arc(posx, posy, 50, 0, 2 * Math.PI);
    context.fill();
}

function createPopup(){
    return "<a href=\"#\" onClick=\"passTitle(); return false;\">Upload</a><noscript>You need Javascript to use the previous link or use <a href=\"index.html\" target=\"_blank\">Upload</a></noscript>";
}

function generateNewEntryCore(){
  //var result += "<p>Some text in the Modal..</p>";
  // for new entry
  var result = "<table>";
  //*
  headers = ['id','title', 'year', 'journalconference', 'author', 'keyword', 'quality', 'summary', 'timestamp', 'contributor', 'link'];
  for(var k=1; k<headers.length; k++){
    if(headers[k]=='timestamp')
      continue;

    result +="<tr>";
    var textValue="";
    if(k==9)
      textValue = getValueFromLS();

    result += "<td class=table_title width=10><b>"+capitalizeFirstLetter(headers[k])+"</b></td>";
    if(k==8)
      result +="<td><textarea onBlur=\"checkEntry("+"'new_paper_"+headers[k]+"');\" style=\"display:none;\" id=\"new_paper_"+headers[k]+"\" cols=\"20\"></textarea></td>";
    else if(k==10)
      result +="<td>"+createPopup()+"</td>";
    else
    result +="<td>"+createTextArea(headers[k], textValue)+"</td>";
    //result +="<td><textarea onBlur=\"checkEntry("+"'new_paper_"+headers[k]+"');\" style=\"border: none; width: 100%; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;\" id=\"new_paper_"+headers[k]+"\" cols=\"20\">"+textValue+"</textarea></td>";

    if(textValue.length==0 || textValue=="[enter new user name]")
      result += "<td width=2><img src=\"asset/undefined.png\" id=\"new_paper_"+headers[k]+"_img\" width=10 height=10 ></td>";
    else {
      result += "<td width=2><img src=\"asset/confirm.png\" id=\"new_paper_"+headers[k]+"_img\" width=10 height=10 ></td>";
    }

    if(k==1){
      result +="</tr><tr><td colspan=3>"+createBibButtons()+"</td></tr>";
      result +="</tr><tr><td><b>Bibtex</b></td><td>"+createTextArea("bib", textValue)+"</td>";
      result += "<td width=2><img src=\"asset/undefined.png\" id=\"new_paper_bib_img\" width=10 height=10 ></td>";
      //result +="</tr><tr><td colspan=3>"+getBibButtons()+"</td></tr>";
    }
    result +="</tr>";
    // result += "<td><input type=\"button\" value=\"Submit\" onclick=\"passNewEntryParameter(99999)\">"+hiddenItem+"</td>";
  }
  result += "<tr><td colspan=3><button id=\"submit_\" onclick=\"passNewEntryParameter('paper', undefined, '"+projectName+"')\">Submit</button> <button onclick=\"clearNewEntry()\">Clear</button></td></tr>";
  result += "</table>";
  return result;
}

function createTextArea(type, textValue){
  return "<textarea onBlur=\"checkEntry('new_paper_"+type+"');\" style=\"border: none; width: 100%; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;\" id=\"new_paper_"+type+"\" cols=\"20\">"+textValue+"</textarea>";
}

function createBibButtons(){
  return "<button onclick=\"passNewEntryParameter('title2doi','title='+getTextareaContent('new_paper_title'));\">Get bib</button><button onclick=\"passNewEntryParameter('bib2file','title='+getTextareaContent('new_paper_title')+'&bib='+getTextareaContent('new_paper_bib'));\"> Save bib</button><span id = \"status\"></span>";
}

function clearNewEntry(){
  for(var k=1; k<headers.length; k++){
    if(headers[k]=='timestamp' || headers[k]=='link' || headers[k]=='contributor')
      continue;
    $("#new_paper_"+headers[k]).val("");
    checkEntry("new_paper_"+headers[k]);
  }
  $("#new_paper_bib").val("");
  checkEntry("new_paper_bib");
}

function checkEntry(entered){
  if($("#"+entered).val().length>0 || $("#"+entered).val()=="[enter new user name]"){
    document.getElementById(entered+"_img").src = "asset/confirm.png";
  }
  else{
    document.getElementById(entered+"_img").src = "asset/undefined.png";
  }
}

function getTitleFromTextArea(){
  return $("#new_paper_title").val();
}

function passTitle(){
  var title = getTitleFromTextArea();
  if(title=="")
    alert("Please enter the paper title before uploading it.");
  else
    window.open('http://localhost:4000/pdfupload?title='+title,'pagename','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable,height=260,width=370'); return true;
}
