require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("../config.json");
const cmdHandler = require("./util/cmdHandler.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ], // Add your desired intents here
});

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith(`<@${client.user.id}>`)) {
    const args = msg.content
      .slice(`<@${client.user.id}>`.length)
      .trim()
      .split(/ +/)
      .filter((arg) => arg.trim());
    //const command = args.shift().toLowerCase();
    if (args.length > 0) {
      cmdHandler.runCommand(msg, args);
    } else {
      msg.reply("What do you want!?");
    }
  }
});

client.login(process.env.TOKEN);
