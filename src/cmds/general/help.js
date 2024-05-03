// fun_hangman.js
const { EmbedBuilder } = require("discord.js");

const general_help = {
  name: "help",
  description: "Display a list of available commands.",
  usage: "help <command_name>",
  call: ["help"], // Define the call property
  execute: (bot, cmd, args, msg) => {
    const commands = bot.cmdHandler.cmds;
    let categorizedCommands = {};

    // Categorize commands
    for (const key in commands) {
      const category = key.split('_')[0];
      const cmdName = key.split('_')[1];
      if (!categorizedCommands[category]) {
        categorizedCommands[category] = [];
      }
      categorizedCommands[category].push(cmdName);
    }

    // If a command name is provided as an argument
    if (args.length > 0) {
      const commandName = args[0];
      let command;

      // Look for the command in all available commands
      for (const key in commands) {
        if (commands[key].call.includes(commandName)) {
          command = commands[key];
          break;
        }
      }

      // If the command exists
      if (command) {
        const embed = new EmbedBuilder()
          .setColor("#ab0000")
          .setTitle(`Command: ${command.name}`)
          .addFields(
            { name: "Description", value: command.description },
            { name: "Aliases", value: command.call.join(", ") },
            { name: "Usage", value: command.usage }
          )
          .setTimestamp();

        msg.channel.send({embeds: [embed]});
      } else {
        msg.channel.send(`The command "${commandName}" does not exist.`);
      }
    } else {
      // If no command name is provided, display the list of commands
      const embed = new EmbedBuilder()
        .setColor("#ab0000")
        .setTitle("Available Commands");

      for (const categoryName in categorizedCommands) {
        const commandsInCategory = categorizedCommands[categoryName].join(", ");
        embed.addFields({ name: `${categoryName.toUpperCase()} Commands`, value: commandsInCategory });
      }

      embed.setTimestamp();

      msg.channel.send({embeds: [embed]});
    }
  }
};

module.exports = { general_help };
