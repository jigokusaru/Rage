// cmdHandler.js

// Import your general commands module
const generalCommands = require("./cmds/general.js");
const funCommands = require("./cmds/fun.js")
const allCommands = [...generalCommands,...funCommands];

// Define a function to handle incoming commands
function handleCommand(args, message) {
  if (args.length > 0) {
    const foundCommand = allCommands.find((cmd) => cmd.name === args[0]);
    if (foundCommand) {
      // Execute the corresponding command function
      foundCommand.execute(message);
    }
  }else{
    message.reply("What do you want?!")
  }
}

// Export the handleCommand function
module.exports = {
  handleCommand,
};
