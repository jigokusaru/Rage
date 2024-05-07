const fs = require("fs");
const path = require("path");

class CmdHandler {
  constructor() {
    this.cmds = {};
  }

  loadCmd(cmdName) {
    const cmdsFolder = path.join(__dirname, "..", "cmds"); // Assuming cmds folder is in the same directory as cmdHandler.js
    const categoryFolders = fs.readdirSync(cmdsFolder);
    for (const category of categoryFolders) {
      const categoryPath = path.join(cmdsFolder, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const cmdPath = findCmdFile(categoryPath, cmdName);
        if (cmdPath) {
          const cmdObject = require(cmdPath); // Load the module
          const commandName = Object.keys(cmdObject)[0]; // Get the name of the command object
          const cmd = cmdObject[commandName]; // Extract the command object from cmdObject
          this.cmds[category + "_" + commandName] = cmd;
          console.log(`${commandName} loaded`);
          return;
        }
      }
    }
    console.log(`Command '${cmdName}' not found.`);
  }

  loadAllCmds() {
    const cmdsFolder = path.join(__dirname, "..", "cmds"); // Assuming cmds folder is in the same directory as cmdHandler.js
    const categoryFolders = fs.readdirSync(cmdsFolder);
    categoryFolders.forEach((category) => {
      const categoryPath = path.join(cmdsFolder, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const cmdsInCategory = fs
          .readdirSync(categoryPath)
          .filter((f) => f.endsWith(".js"));
        cmdsInCategory.forEach((cmdFile) => {
          const cmdPath = path.join(categoryPath, cmdFile);
          const cmdObject = require(cmdPath); // Load the module
          const commandName = Object.keys(cmdObject)[0]; // Get the name of the command object
          const cmd = cmdObject[commandName]; // Extract the command object from cmdObject
          this.cmds[commandName] = cmd;
          console.log(`${commandName} loaded`);
        });
      }
    });
  }

  unloadCmd(cmdName) {
    if (this.cmds.hasOwnProperty(cmdName)) {
      delete this.cmds[cmdName];
      console.log(`Command '${cmdName}' unloaded.`);
      // Remove the cached module from require.cache
      const cmdPath = require.resolve(
        path.join(__dirname, "..", "cmds", `${cmdName}.js`)
      );
      delete require.cache[cmdPath];
    } else {
      console.log(`Command '${cmdName}' not found.`);
    }
  }
  

  async runCmd(bot, cmd, args, msg) {
    // Find the command object
    const commandKey = Object.keys(this.cmds).find((key) =>
      this.cmds[key].call.includes(cmd)
    );
    const command = this.cmds[commandKey];

    if (command) {
      // Check if the command is an RPG command and not the 'startrpg' command
      if (commandKey.startsWith("rpg_") && command.name !== "startrpg") {
        // Check if a game has been started in the guild
        let tables = await bot.dbHandler.runQuery("SHOW TABLES LIKE ?", [
          `rpg_${msg.guild.id}%`,
        ]);
        if (tables.length === 0) {
          // If no game has been started, inform the user
          return msg.channel.send("A game needs to be started by staff.");
        }

        // Extract the table name
        let tableName = Object.values(tables[0])[0];

        // Remove the 'rpg_' prefix from the table name
        let ids = tableName.replace("rpg_", "");

        // Extract the guild ID and channel ID
        let guildIdLength = msg.guild.id.length;
        let extractedGuildId = ids.substring(0, guildIdLength);
        let rpgChannelId = ids.substring(guildIdLength);

        if (msg.channel.id !== rpgChannelId) {
          // If the command is not being run in the correct channel, inform the user
          return msg.channel.send(
            "You have to run the command in the correct channel."
          );
        }
      }

      const index = await bot.dbHandler.getId(msg.author.id);
      command.execute(bot, cmd, args, msg);
      await bot.dbHandler
        .addUser(msg.author.id)
        .then(() => console.log("User added."))
        .catch((err) => console.error(err.message));
      await bot.levelHandler.addExp(msg.author.id, 1);
      await bot.achievementHandler.setAchievement(index, 0, msg);
    }
  }
}
function findCmdFile(folder, cmdName) {
  const files = fs.readdirSync(folder);
  for (const file of files) {
    const filePath = path.join(folder, file);
    if (fs.statSync(filePath).isDirectory()) {
      const cmdPath = findCmdFile(filePath, cmdName);
      if (cmdPath) {
        return cmdPath;
      }
    } else if (file === `${cmdName}.js`) {
      return filePath;
    }
  }
  return null;
}
module.exports = { CmdHandler };
