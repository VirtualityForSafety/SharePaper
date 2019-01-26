var multer	=	require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const baseDir = './resources/';
var projectName= 'uncategorized';
module.exports = function(app)
{
  var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
      var uploadPath = baseDir +projectName;
      callback(null, uploadPath);
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now()+".pdf");
    }
  });
  var upload = multer({ storage : storage}).single('userPaper');

  app.get('/pdfupload',function(req,res){
    console.log("GG");
    projectName = req.param('proj');
    //console.log(req.allParams());
    //res.send('Hello World');
    res.sendFile(__dirname + "/pdfFileUpload.html");
  });

  app.post('/api/pdf',checkUploadPath, function(req,res){
   upload(req,res,function(err) {
     if(err) {
       return res.end("Error uploading file.");
     }
     res.end("File is uploaded");
   });
  });
}

// for creating a folder when it doesn't exist
function checkUploadPath(req, res, next) {
  var uploadPath = baseDir +projectName;
     fs.exists(uploadPath, function(exists) {
        if(exists) {
          next();
        }
        else {
          fs.mkdir(uploadPath, function(err) {
            if(err) {
              console.log('Error in folder creation');
              next();
            }
            next();
          })
        }
     })
}
