function passNewEntryParameter(projectName, type){
  // get values from using jquery
  var headers = ['id'];
  var data = [99999];
  $(".new_entry").each(function(){
    var tdElements = $(this).find('textarea');
    if (tdElements.length>1){
      for(var i=0; i<tdElements.length;i++){
        headers.push(tdElements[i].id.split("_").pop());
        console.log(headers[headers.length-1]);
        if(headers[headers.length-1]=='timestamp'){
          data.push("time");
        }
        else{
          data.push($("#"+tdElements[i].id).val());
        }
      }
    }
  });
  //console.log(headers);
  //console.log(createNewEntryParameters(headers,data));
  if(validateInput(data, headers)){
    /*
    $.ajax({
        global: false,
        type: 'POST',
        url: 'http://localhost:1209/',
        dataType: 'html',
        data: {
            title: $("#new_paper_title").val()
        },
        success: function (result) {
            console.log(result);
        },
        error: function (request, status, error) {
          console.log(error);
            //serviceError();
        }
    });
    */
    //console.log('http://localhost:1209/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data));
    //window.history.replaceState(null, null, 'http://localhost:1209/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data));
    //window.history.replaceState(null, null, location.href + 'http://localhost:1209/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data));
    //var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname +'/'+ type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
    //newurl = window.location.protocol + "//" + window.location.host + '/'+ type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
    //newurl = 'http://localhost:1209/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
    //console.log(newurl);
    //window.history.pushState({path:newurl},'',newurl);

    window.location.href='http://localhost:1209/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
  }else{
    //alert("Please fill all fields.");
    alert("Please enter paper title.");
  }
}



function passOneParameter(projectName, divElement){
  partialUpdate(projectName, $("#"+divElement.id));
}

function createNewEntryParameters(headers, data){
  var result ="";
  for (var i=0 ; i<headers.length ; i++){
    if(i==0)
      result+= headers[i].replace(" ","").replace("/","").toLowerCase() + "=" + data[i]+"&";
    else
      result+= headers[i].replace(" ","").replace("/","").toLowerCase() + "='" + data[i]+"'&";
  }
  return result;
}

function validateInput(my_arr, comp_arr){
   //for(var i=0;i<my_arr.length;i++){
   if(my_arr[1]==""){
     //if(!(my_arr.length == comp_arr.length)){
       return false;
     }
   //}
   return true;
}
