const rpg_startRpg = {
  name: "startrpg",
  description: "Start the RPG game in the current channel.",
  call: ["startrpg","srpg"],
  usage: "startrpg",
  execute: async (bot, cmd, args, msg) => {
    // Get the guild ID and channel ID from the message
    const guildId = msg.guild.id;
    const channelId = msg.channel.id;

    // Start the RPG game in this channel
    const result = await bot.rpgHandler.start(guildId, channelId);

    // If the start method returned a message, send it to the channel
    if (result) {
      msg.channel.send(result);
    } else {
      msg.channel.send("The RPG game has started in this guild!");
    }
  },
};

module.exports = { rpg_startRpg };
