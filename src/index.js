// index.js

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] // Add your desired intents here
});

// Event: When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Event: When a message is created
client.on('messageCreate', (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if the message starts with the bot mention (prefix)
    const botMention = `<@${client.user.id}>`;
    if (message.content.startsWith(botMention)) {
      
    }
        
});

// Log in to Discord with the bot token from .env
client.login(process.env.TOKEN);
