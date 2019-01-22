function insertTopLink(){
  var shareButton ="<input class=\"top_share\" type=\"button\" value=\"Share \" onClick=\"location.href='index.html'\">";
  var paperButton ="<input class=\"top_paper\" type=\"button\" value=\" Paper\" onClick=\"location.href='paper.html'\">";
  return shareButton+paperButton+"<br>";
}

document.getElementById("topLink").innerHTML = insertTopLink();
