// from http://jsfiddle.net/mblase75/dcqxr/


  var sum = 0;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "tag7.txt",
        dataType: "text",
        success: function(data) {

        document.getElementById("sectionTag").innerHTML = processData(data); 
        prepareAnimatedCSS();
    }        
    });
});


function prepareAnimatedCSS(){
  var tile = $('.strips__strip');
  var tileLink = $('.strips__strip > .strip__content');
  var tileText = tileLink.find('.strip__inner-text');
  var stripClose = $('.strip__close');
var stripTitle = $('.strip__title');

  var expanded  = false;

  var open = function() {
   

    var tile = $(this).parent();

      if (!expanded) {
        tile.addClass('strips__strip--expanded');
        $(".strips__strip--expanded").css("width","100%");
        // add delay to inner text
        tileText.css('transition', 'all .5s .3s cubic-bezier(0.23, 1, 0.32, 1)');
        stripClose.addClass('strip__close--show');
        stripClose.css('transition', 'all .6s 1s cubic-bezier(0.23, 1, 0.32, 1)');
        expanded = true;
      } 
    };
  
  var close = function() {
    if (expanded) {
        tile.removeClass('strips__strip--expanded');
        var num = 100/sum;
       $(".strips__strip").css("width", String(num)+"\%");
      // remove delay from inner text
      tileText.css('transition', 'all 0.15s 0 cubic-bezier(0.23, 1, 0.32, 1)');
      stripClose.removeClass('strip__close--show');
      stripClose.css('transition', 'all 0.2s 0s cubic-bezier(0.23, 1, 0.32, 1)');
       
      expanded = false;
    }
  };

    var adjustCSS = function(){
    // adjust bar width
    sectionTag.classList.add(".strips__strip");
    $(".strips__strip").css("will-change","width, left, z-index, height");
    $(".strips__strip").css("position","absolute");
    $(".strips__strip").css("width",String(100/sum)+"\%");
    $(".strips__strip").css("min-height","100vh");
    $(".strips__strip").css("overflow","hidden");
    $(".strips__strip").css("cursor","pointer");
    $(".strips__strip").css("transition","all 0.6s cubic-bezier(0.23, 1, 0.32, 1)");
    
    // adjust bar style
    var colors = ["#244F75", "#60BFBF", "#8C4B7E", "#F8BB44", "#F24B4B"];
    for (var i=0; i<sum; i++) {
        sectionTag.classList.add(".strips__strip:nth-child("+String(i+1)+")");
        $(".strips__strip:nth-child("+String(i+1)+")").css("left", String(100/sum*i)+"vw");
        $(".strips__strip:nth-child("+String(i+1)+") .strip__content").css("background", colors[i%5]);
        $(".strips__strip:nth-child("+String(i+1)+") .strip__content").css("transform", "translate3d(-100%, 0, 0)");
        $(".strips__strip:nth-child("+String(i+1)+") .strip__content").css("animation-name", "strip1");
        $(".strips__strip:nth-child("+String(i+1)+") .strip__content").css("animation-delay", String(0.05*i)+"s");
        }
    }
    var bindActions = function() {
      tileLink.on('click', open);
      stripClose.on('click', close);
    };
    bindActions();
    adjustCSS();
  }


function processData(allText) {
  console.log(allText);
    var allTextLines = allText.split(',');
    sum = allTextLines.length;
    var lines = [];
    var result = ""
    $
    for (var i=0; i<allTextLines.length; i++) {
      var subresult = "<article class=\"strips__strip\"><div class=\"strip__content\">\n<h1 class=\"strip__title\" data-name=\"Ipsum\">\n";
      subresult += (allTextLines[i]);
      subresult += "</h1>      <div class=\"strip__inner-text\">        <h2>Ettrics</h2>        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia sapiente deserunt consectetur, quod reiciendis corrupti quo ea aliquid! Repellendus numquam quo, voluptate. Suscipit soluta omnis quibusdam facilis, illo voluptates odit!</p>        <p>          <a href=\"https://twitter.com/ettrics\" target=\"_blank\"><i class=\"fa fa-twitter\"></i></a>        </p>      </div>    </div></article>";
      result += subresult;
       
    
    }
    result += "<i class=\"fa fa-close strip__close\"></i>";
console.log(allTextLines);

console.log(sum);



  return result;
}