// general.js
const {DbHandler} = require("../dbHandler");
//const {client} = require('../index.js');

// Define an array to hold all the general commands
const funCommands = require("./fun")
const { EmbedBuilder } = require("discord.js");
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
    //commands = [...generalCommands.map(command => command.name),...funCommands.map(command => command.name)]
    const helpEmbed = {
      color: 0xab0000,
      title: "Command List",
      description: "A list of commands Rage can use.",
      fields:[
        {
          name: "General Cmmands",
          value: `${generalCommands.map(command => command.name)}`,
        },
        {
          name: "Fun Cmmands",
          value: `${funCommands.map(command => command.name)}`,
        }
      ],
      timestamp: new Date().toISOString(),
    }
    message.reply({ embeds: [helpEmbed] });
  },
};

const evalCommand = {
    name: "eval",
    description: "Evaluate JavaScript code (restricted to specific users).",
    usage: "eval <code>",
    execute: (message) => {
        // Check if the author's ID matches the allowed IDs
        const allowedUserIds = ["424337832648376333", "113375429414416384"];
        if (!allowedUserIds.includes(message.author.id)) {
            return message.reply("You are not authorized to use this command.");
        }

        // Get the code to evaluate
        const code = message.content.slice(message.content.indexOf(" ") + 6);
        console.log(code)

        try {
            // Evaluate the code
            const result = eval(code);
            message.reply(`Result: ${result}`);
        } catch (error) {
            message.reply(`Error: ${error.message}`);
        }
    },
};

// Add the ping command to the list
generalCommands.push(pingCommand);
generalCommands.push(helpCommand);
generalCommands.push(evalCommand);

module.exports = generalCommands;
