// index.js

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { handleCommand } = require("./cmdHandler.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ], // Add your desired intents here
});

// Event: When the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
});

// Event: When a message is created
client.on("messageCreate", (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;
  if (message.content.startsWith(`<@${client.user.id}>`)) {
    const args = message.content
      .slice(`<@${client.user.id}>`.length)
      .trim()
      .split(/ +/)
      .filter((args) => args.trim());
    console.log(message);
    // Call the handleCommand function
    handleCommand(args, message);
  }
});

// Log in to Discord with the bot token from .env
client.login(process.env.TOKEN);
