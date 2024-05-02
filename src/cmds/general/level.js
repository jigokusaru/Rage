const { EmbedBuilder } = require("discord.js");

const general_level = {
  name: "level",
  description: "Get the user's current level and experience progress.",
  call: ["level", "lvl"],
  usage: "level",
  execute: async (bot, cmd, args, msg) => {
    // Get the user's current level and total experience
    const level = await bot.levelHandler.getLevel(msg.author.id);
    const totalExp = await bot.levelHandler.getExp(msg.author.id);

    // Calculate the experience needed for the current and next levels
    const currentLevelExp = bot.levelHandler.expForLevel(level);
    const nextLevelExp = bot.levelHandler.expForLevel(level + 1);

    // Calculate the experience gained since the last level up and the experience needed to level up
    const expGained = totalExp - currentLevelExp;
    const expToNextLevel = nextLevelExp - currentLevelExp;

    // Create an embed message
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle(`${msg.author.username}'s Level`)
      .setThumbnail(msg.author.avatarURL())
      .setDescription(`You are currently level ${level}.`)
      .addFields(
        {name: "Experience", value: `${expGained}/${expToNextLevel} EXP`, inline: true}
      );

    // Send the embed message
    msg.channel.send({ embeds: [embed] });
  },
};

module.exports = { general_level };
