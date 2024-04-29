require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { CmdHandler } = require("./util/cmdHandler");

const cmdhandler = new CmdHandler()
class Bot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    }),
    this.cmdHandler = cmdhandler;
  }
  onReady() {
    this.client.once("ready", () => {
      this.cmdHandler.loadAllCmds();
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

      if (command.length == 0 && prefix === `<@${this.client.user.id}>`) {
        msg.channel.send("WHAT THE FUCK DO YOU WANT!? Do I look ready!?");
      } else if(command.length > 0){
        const cmd = command[0]
        const args = command.slice(1);
        this.cmdHandler.runCmd(this,cmd,args,msg)
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
