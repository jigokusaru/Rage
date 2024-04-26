// general.js

// Define an array to hold all the general commands
const generalCommands = [];

// Define the ping command
const pingCommand = {
  name: "ping",
  description: "Check if the bot is responsive.",
  usage: "ping",
  execute: (message) => {
    message.reply("Pong!");
  },
};

const helpCommand = {
  name: "help",
  description: "lists the commands",
  usage: "help",
  execute: (message) => {
    commands = [...generalCommands.map(command => command.name)]
    message.reply(commands.sort().join(', '));
  },
};

// Add the ping command to the list
generalCommands.push(pingCommand);
generalCommands.push(helpCommand);

module.exports = generalCommands;
