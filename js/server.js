// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 4000;

var fileUploader = require('./fileUploader/fileUploader')(app);
var bibRouter = require('./router/routeBib.js')(app);
var metadataRouter = require('./router/routeMetadata.js')(app);

app.use(express.static('./'));
app.listen(port);
console.log('SharePaper: web server running on 4000...');
