// index.js
require("dotenv").config();
const { Client, GatewayIntentBits, PresenceUpdateStatus,ActivityType  } = require("discord.js");
const { CmdHandler } = require("./util/cmdHandler");
const { DbHandler } = require("./util/dbHandler");
const { LevelHandler } = require("./util/levelHandler");
const { AchievementHandler } = require("./util/achievmentHandler");
const { GameHandler } = require("./util/gameHandler");
//const { RpgHandler } = require("./disabled/rpgHandler");
//const { ShopHandler } = require("./disabled/shopHandler");
const createPokedexHandler = require("./util/pokedexHandler");

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
      createPokedexHandler().then(handler => {
        this.pokedexHandler = handler;
        //this.shopHandler = new ShopHandler(this); // Create the ShopHandler after the PokedexHandler is ready
      });
    this.dbHandler = new DbHandler("discord_data");
    this.levelHandler = new LevelHandler(this);
    this.gameHandler = new GameHandler();
    //this.rpgHandler = new RpgHandler(this);
    this.achievementHandler = new AchievementHandler(this);
    this.achievments = [
      {
        name: "Use Your First Command!",
        description: "You did it, you used a command!",
        exp: 5,
      },
      {
        name: "Want Attention Do you?!",
        description: "You wanted attention, you got it!",
        exp: 5,
      },
    ];
  }
  onReady() {
    this.client.once("ready", () => {
      this.cmdHandler.loadAllCmds();
      this.dbHandler.initializeDb();
      this.achievementHandler.addAchievements(this.achievments);
      console.log(`${this.client.user.username} is ready!`);
      this.client.user.setPresence({ activities: [{ name: 'you suffer!' ,type: ActivityType.Watching}], status: PresenceUpdateStatus.Dnd})
    });
  }

  onMessage() {
    this.client.on(`messageCreate`, async (msg) => {
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
        const index = await bot.dbHandler.getId(msg.author.id);
        msg.channel.send("WHAT THE HELL DO YOU WANT!?");
        this.achievementHandler.setAchievement(index, 1, msg);
      } else if (command.length > 0) {
        const cmd = command[0].toLowerCase();
        const args = command.slice(1);
        this.cmdHandler.runCmd(this, cmd, args, msg);
      }
    });
  }

  onInteraction() {
    this.client.on("interactionCreate", async (interaction) => {
      //await this.shopHandler.handleInteraction(interaction,this);
    });
  }

  login() {
    this.client.login(process.env.TOKEN);
  }
}
const bot = new Bot();
bot.onReady();
bot.onMessage();
bot.onInteraction(); // Add the interactionCreate event listener
bot.login();
