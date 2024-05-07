const rpg_endRpg = {
  name: "endrpg",
  description: "End the RPG game in the current channel.",
  call: ["endrpg","erpg"],
  usage: "end confirm",
  execute: async (bot, cmd, args, msg) => {
    // Check if the user is an admin or owner
    if (!msg.member.permissions.has("ADMINISTRATOR")) {
      return msg.reply("You must be an admin or owner to end the RPG game.");
    }

    // Check if the 'confirm' argument was provided
    if (args[0] !== "confirm") {
      return msg.reply("Please confirm the end of the RPG game by using the 'confirm' argument.");
    }

    // Get the guild ID and channel ID from the message
    const guildId = msg.guild.id;
    const channelId = msg.channel.id;

    // End the RPG game in this channel
    const result = await bot.rpgHandler.end(guildId, channelId);

    // If the end method returned a message, send it to the channel
    if (result) {
      msg.channel.send(result);
    } else {
      msg.channel.send("The RPG game has ended in this channel!");
    }
  },
};

module.exports = { rpg_endRpg };
