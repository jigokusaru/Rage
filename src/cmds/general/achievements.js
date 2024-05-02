const { EmbedBuilder } = require("discord.js");

const general_achievements = {
  name: "achievements",
  description: "List all the achievements a user has.",
  call: ["achievements", "ach"],
  usage: "achievements",
  execute: async (bot, cmd, args, msg) => {
    // Get the user's achievements
    console.log(await bot.dbHandler.getId(msg.author.id))
    let query = "SELECT * FROM user_achievements WHERE user_id = ?";
    let params = [await bot.dbHandler.getId(msg.author.id)];
    let userAchievements = await bot.dbHandler.runQuery(query, params);

    // Get the details of each achievement
    let achievements = [];
    for (let userAchievement of userAchievements) {
      query = "SELECT * FROM achievements WHERE achievement_id = ?";
      params = [userAchievement.achievement_id];
      let achievementDetails = await bot.dbHandler.runQuery(query, params);
      achievements.push(achievementDetails[0]);
    }

    // Create an embed message
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle(`${msg.author.username}'s Achievements`)
      .setThumbnail(msg.author.avatarURL())
      .setDescription(`You have unlocked ${achievements.length} achievements!`);

    // Add each achievement to the embed
    for (let achievement of achievements) {
      embed.addFields({name: achievement.name, value: '\u200B'});
    }

    // Send the embed message
    msg.channel.send({ embeds: [embed] });
  },
};

module.exports = { general_achievements };
