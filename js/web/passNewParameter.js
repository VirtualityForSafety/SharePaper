function passNewEntryParameter(url, data, target) {

  // GET requires we add the name=value pairs to the end of the URL.
  url += '?' + data;

    // Create a new AJAX request object
    var request = new XMLHttpRequest();

    // Open a connection to the server
    request.open('POST', url);
    console.log(url);
    // Run our handleResponse function when the server responds
    if(target=="rst1")
      request.addEventListener('readystatechange', handleResponseToPrivate);
    else
      request.addEventListener('readystatechange', handleResponseToPublic);
    //request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Actually send the request (with the POST data)
    request.send( data );

    // Actually send the request
    //request.send();
}

function handleResponseToPublic() {
  var target='rst2';
    var request = this;
    if (request.readyState != 4)
        return;
    if (request.status == 200)
      $('#'+target).val(request.responseText);
}

function handleResponseToPrivate() {
  var target='rst1';
    var request = this;
    if (request.readyState != 4)
        return;
    if (request.status == 200)
      $('#'+target).val(request.responseText);
}

/*
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
    //console.log('http://localhost:4000/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data));
    //window.history.replaceState(null, null, 'http://localhost:4000/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data));
    //window.history.replaceState(null, null, location.href + 'http://localhost:4000/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data));
    //var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname +'/'+ type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
    //newurl = window.location.protocol + "//" + window.location.host + '/'+ type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
    //newurl = 'http://localhost:4000/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
    //console.log(newurl);
    //window.history.pushState({path:newurl},'',newurl);

    window.location.href='http://localhost:4000/'+type+'?'+'proj='+projectName+'&'+createNewEntryParameters(headers,data);
  }else{
    //alert("Please fill all fields.");
    alert("Please enter paper title.");
  }
}
*/


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
