// help.js
const { EmbedBuilder } = require("discord.js");

const general_help = {
  name: "help",
  description: "Display a list of available commands.",
  usage: "help",
  call: ["help"], // Define the call property
  execute: (bot, cmd,args, msg) => {
    const commands = bot.cmdHandler.cmds;
    const categorizedCommands = {};

    // Step 1: Categorize commands
    for (const commandName in commands) {
      const categoryName = Object.keys({ [commandName]: commands[commandName] })[0].split('_')[0];
      const cmdName = Object.keys({ [commandName]: commands[commandName] })[0].split('_')[1];
      if (!categorizedCommands[categoryName]) {
        categorizedCommands[categoryName] = [];
      }
      categorizedCommands[categoryName].push(cmdName);
    }

    // Step 2: Create embed
    const embed = new EmbedBuilder()
      .setColor("#ab0000")
      .setTitle("Available Commands");

    // Step 3: Add categorized commands to the embed
    for (const categoryName in categorizedCommands) {
      const commandsInCategory = categorizedCommands[categoryName].join(", ");
      embed.addFields({ name: `${categoryName.toUpperCase()} Commands`, value: commandsInCategory });
    }

    embed.setTimestamp()

    // Step 4: Send the embed
    msg.channel.send({embeds: [embed]});
  }
};

module.exports = { general_help };
