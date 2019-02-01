function setValueToLS(value){
  if(typeof(Storage)!=="undefined")
  {
      localStorage.setItem("contributor_local" , value);
  }
}

function getValueFromLS()
{
  var value = localStorage.getItem('contributor_local');
  if(value==undefined || value == null)
    return '[enter new user name]';
  else {
    return value;
  }
}

function saveUserName(id){
  var userEntry = document.getElementById(id);
  var value = userEntry.textContent;
  setValueToLS(value);
}
