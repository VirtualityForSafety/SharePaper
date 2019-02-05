// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 4000;

var fileUploader = require('./fileUploader/fileUploader')(app);
var router = require('./router/router.js')(app);

app.use(express.static('./'));
app.listen(port);
console.log('SharePaper: web server running on 4000...');
