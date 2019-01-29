var fs = require('fs');
var dir = './metadata/';
var templateDir = './metadata/template/';

module.exports = {
  add: function (projectName) {
    var newDir = dir+projectName+'/';
    var creationResult = module.exports.createFolder(newDir);
    if(!creationResult)
      return -1;
    return copyAndPasteFiles(newDir);
  },
  createFolder: function (newDir){
    if (newDir == ".")
      return false;
    console.log(newDir);
    if (newDir.endsWith("/"))
      newDir = newDir.substring(0,newDir.length-1);
    console.log(newDir);
    if (!fs.existsSync(newDir)){
      if(newDir.includes('/')){
        console.log(newDir + " -> " + newDir.split('/').slice(0,-1).join('/'));
        module.exports.createFolder(newDir.split('/').slice(0,-1).join('/'));
      }
      console.log(newDir);
        fs.mkdirSync(newDir);
        return true;
    }
    else return false;
  }
};

function copyAndPasteFiles(newDir){
  fs.readdir(templateDir, (err, files) => {
  files.forEach(file => {
    console.log(templateDir + file);
    console.log(newDir + file);
    fs.copyFile(templateDir + file, newDir+file, (err) => {
      if (err) throw err;
      console.log('source was copied to destination.');
    });
    });
  })
  return 1;
}
