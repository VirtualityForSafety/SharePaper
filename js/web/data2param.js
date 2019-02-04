function stringify(data) {
   const ret = [];

	 for (var [key, value] of data) {
		 ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	 }
   return ret.join('&');
}

function integrate2Map(keyArray, valueArray){
	if(keyArray.length!=valueArray.length)
		return undefined;
	var result = new Map();
	for(var i=0; i<keyArray.length ; i++){
		if(i==0)
			result.set(keyArray[i], valueArray[i]);
		else
			result.set(keyArray[i], "'" + valueArray[i]+ "'");
	}
	return result;
}
