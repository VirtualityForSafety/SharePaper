module.exports = {
  getCurrentTime: function (){
    var date = new Date();
    var dateUTC = convertLocalDateToUTCDate(date);
    return dateUTC;
  }
};

function zeroPad(nr,base){
  var  len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

function convertLocalDateToUTCDate(date) {
  var newDate = new Date(date.getTime()-date.getTimezoneOffset()*60*1000);
  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();
  newDate.setHours(hours + offset);
  var datevalues = [
    zeroPad(newDate.getFullYear(),1000),
    zeroPad(newDate.getMonth()+1,10),
    zeroPad(newDate.getDate()-1,10),
    zeroPad(newDate.getHours(),10),
    zeroPad(newDate.getMinutes(),10),
    zeroPad(newDate.getSeconds(),10)
  ];
   return datevalues.join('/');
}
