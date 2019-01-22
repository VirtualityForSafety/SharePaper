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

function insertTopLink(){
  var projectName = getProjectNameFromLink();
  var shareButton ="<input class=\"top_share\" type=\"button\" value=\"Share \" onClick=\"location.href='share.html?proj="+projectName+"&'\">";
  var paperButton ="<input class=\"top_paper\" type=\"button\" value=\" Paper\" onClick=\"location.href='paper.html?proj="+projectName+"&'\">";
  return shareButton+paperButton+"<br>";
}

document.getElementById("topLink").innerHTML = insertTopLink();
