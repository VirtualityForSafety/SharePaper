var exec = require('child_process').exec;
var serverTime = require('./serverTime');

module.exports = {
  commitAndPush: function(contributor, passedRes = undefined){
    var command = 'git add *';
    child = exec(command,
       function (error, stdout, stderr) {
          if (error !== null) {
              console.log('exec error: ' + error);
              if(passedRes!=undefined)
              {
                passedRes.send('exec error: ' + error);
              }
          }
          else{
            command = 'git commit -m \"'+contributor +'\'s commit '+serverTime.getCurrentTime()+'\"';
            child = exec(command,
               function (error, stdout, stderr) {
                  if (error !== null) {
                      console.log('exec error: ' + error);
                  }
                  else{
                    console.log("commit success!");
                    module.exports.push2master(passedRes);
                  }
               });
          }
       });
  },
  commit: function (contributor, passedRes = undefined) {
    var command = 'git add *';
    child = exec(command,
       function (error, stdout, stderr) {
          if (error !== null) {
              console.log('exec error: ' + error);
              if(passedRes!=undefined)
              {
                passedRes.send('exec error: ' + error);
              }
          }
          else{
            command = 'git commit -m \"'+contributor +'\'s commit '+serverTime.getCurrentTime()+'\"';
            child = exec(command,
               function (error, stdout, stderr) {
                  if (error !== null) {
                      console.log('exec error: ' + error);
                  }
                  else{
                    console.log("commit success!");
                    if(passedRes!=undefined)
                    {
                      passedRes.send(stdout);
                    }
                    return stdout;
                  }
               });
          }
       });
  },
  push2master: function (passedRes = undefined) {
    var command = 'git push origin master';
    child = exec(command,
       function (error, stdout, stderr) {
          if (error !== null) {
              console.log('exec error: ' + error);
              if(passedRes!=undefined)
              {
                passedRes.send('exec error: ' + error);
              }
          }
          else{
            console.log("push success!");
            if(passedRes!=undefined)
            {
              passedRes.send(stdout);
            }
            return stdout;
          }
       });
  },
};
