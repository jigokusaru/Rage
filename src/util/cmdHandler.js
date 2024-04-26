// cmdHandler.js

const {commands} = require("./loadCmds");

const cmds = commands;
// Export the getCommand function
 function runCommand(msg, args) {
    const commandName = args[0].toLowerCase();
    if (cmds[commandName]) {
        // Execute the command
        cmds[commandName].execute(msg, args.slice(1));
    }
}

function getCommands(){
    return cmds
}


module.exports = { runCommand, getCommands} 
