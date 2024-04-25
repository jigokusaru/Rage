// cmdHandler.js

const {commands} = require("./loadCmds");
// Export the getCommand function
 function runCommand(msg, args) {
    const commandName = args[0].toLowerCase();
    if (commands[commandName]) {
        // Execute the command
        commands[commandName].execute(msg, args.slice(1));
    }
}


module.exports = { runCommand} 
