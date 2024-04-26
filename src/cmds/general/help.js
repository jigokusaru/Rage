// help.js

const { EmbedBuilder  } = require('discord.js');
const { getCommands } = require('../../util/cmdHandler');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands.',
    usage: 'help',
    info: 'This command lists all available commands.',

    execute(msg, args) {
        // Create an embed to display the list of commands
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setDescription('Here are the available commands:')
            .setTimestamp();

        // Add each command to the embed
        for (const commandName in getCommands) {
            const command = getCommands[commandName];
            embed.addField(command.name, command.description);
        }

        // Send the embed as a reply
        msg.reply({ embeds: [embed] });
    },
};