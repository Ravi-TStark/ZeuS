
var is = require("electron-is");

// Mac and Linux have Bash shell scripts (so the following would work)
//        var child = process.spawn('child', ['-l']);
//        var child = process.spawn('./test.sh');       
// Win10 with WSL (Windows Subsystem for Linux)  https://docs.microsoft.com/en-us/windows/wsl/install-win10
//   
// Win10 with Git-Bash (windows Subsystem for Linux) https://git-scm.com/   https://git-for-windows.github.io/
//

var currpath = '/Users/sairaveendrakandregula/Documents/GitHub/';

var fs = require('fs');

const os = require('os')
const username = os.userInfo().username

function appendOutput(msg) {
  getCommandOutput().value = getCommandOutput().value.trimStart();
  getCommandOutput().value += (msg + '\n');
  
  var textarea = document.getElementById('console-output');
  textarea.scrollTop = textarea.scrollHeight;
};
function setStatus(msg) { console.log(msg); };

function showOS() {
  if (is.windows())
    appendOutput("Zeus Terminal Emulator for Windows\n")
  if (is.macOS())
    appendOutput("Zeus Terminal Emulator for macOS\n")
  if (is.linux())
    appendOutput("Zeus Terminal Emulator for Linux\n")
}

function InitConsole(){
  showOS();
  getCommandOutput().value += (username + ' ~ ' + currpath + '> ');
}

function backgroundProcess(commandValue) {
  const process = require('child_process');   // The power of Node.JS

  var cmd = (is.windows()) ? 'test.bat' : './test.sh';

    fs.writeFileSync(cmd, 'cd \"' + currpath + '\" \n' + commandValue, 'utf-8'); 
  
  console.log('cmd:', cmd);
  appendOutput(commandValue);

  var child = process.spawn(cmd);

  child.on('error', function (err) {
    appendOutput('stderr: <' + err + '>');
  });

  child.stdout.on('data', function (data) {
    appendOutput(data);
    currpath = child.cwd()
  });

  child.stderr.on('data', function (data) {
    var dat = data.toString().substring(11)
    appendOutput(dat.substring(dat.indexOf(":") + 2));
  });

  child.on('close', function (code) {
    if (code == 0)
      setStatus('child process complete.');
    else
      setStatus('child process exited with code ' + code);

      getCommandOutput().value += (username + ' ~ ' + currpath + '> ');
      var textarea = document.getElementById('console-output');
      textarea.scrollTop = textarea.scrollHeight;
  });

};
