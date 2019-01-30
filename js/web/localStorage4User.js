function setValueToLS(value){
  if(typeof(Storage)!=="undefined")
  {
      localStorage.setItem("user" , value);
  }
}

function getValueFromLS()
{
  var value = localStorage.getItem('user');
  if(value==undefined || value == null)
    return '[enter new user name]';
  else {
    return value;
  }
}
