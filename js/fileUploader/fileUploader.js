var multer	=	require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const folderCreator = require('../data/addProject')
const baseDir = './resources/pdf/';
var projectName= 'uncategorized';
module.exports = function(app)
{
  var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
      //
      var uploadPath = baseDir;
      callback(null, uploadPath);
    },
    filename: function (req, file, callback) {
      console.log("!!");
      var paperTitle= req.param('title');
      console.log(paperTitle);
      if (paperTitle==undefined)
        paperTitle = file.fieldname + '-' + Date.now();
      //console.log(paperTitle);
      callback(null, paperTitle+".pdf");
    }
  });
  var upload = multer({ storage : storage}).single('userPaper');

  app.get('/pdfupload',function(req,res){
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
  if(folderCreator.createFolder(baseDir)>0)
    next();
  /*
  var uploadPath = baseDir;
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
     */
}
