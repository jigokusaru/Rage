// general.js

// Define an array to hold all the general commands
const generalCommands = [];

// Define the ping command
const pingCommand = {
    name: 'ping',
    description: 'Check if the bot is responsive.',
    usage: 'ping',
    execute: (message) => {
        message.reply('Pong!');
    },
};

// Add the ping command to the list
generalCommands.push(pingCommand);

module.exports = generalCommands;
