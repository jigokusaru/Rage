require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { CmdHandler } = require("./util/cmdHandler");
const { DbHandler } = require("./util/dbHandler");

class Bot {
  constructor() {
    (this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    })),
      (this.cmdHandler = new CmdHandler());
    this.dbHandler = new DbHandler("discord_db.db");
  }
  onReady() {
    this.client.once("ready", () => {
      this.cmdHandler.loadAllCmds();
      this.dbHandler.initializeDb();
      console.log(`${this.client.user.username} is ready!`);
    });
  }

  onMessage() {
    this.client.on(`messageCreate`, (msg) => {
      if (msg.author.bot) return;
      const prefixes = [`<@${this.client.user.id}>`, "$"];
      const content = msg.content.trim();

      // Check if the message starts with any of the prefixes
      const prefix = prefixes.find((p) => content.startsWith(p));

      if (!prefix) return; // No valid prefix found

      const command = content
        .slice(prefix.length)
        .trim()
        .split(/ +/)
        .filter((args) => args.trim());
      bot.dbHandler
        .addUser("1234567890")
        .then(() => console.log("User added."))
        .catch((err) => console.error(err.message));
      if (command.length == 0 && prefix === `<@${this.client.user.id}>`) {
        msg.channel.send("WHAT THE FUCK DO YOU WANT!? Do I look ready!?");
      } else if (command.length > 0) {
        const cmd = command[0];
        const args = command.slice(1);
        this.cmdHandler.runCmd(this, cmd, args, msg);
      }
    });
  }

  login() {
    this.client.login(process.env.TOKEN);
  }
}
const bot = new Bot();
bot.onReady();
bot.onMessage();
bot.login();
