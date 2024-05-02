const { EmbedBuilder } = require("discord.js");

class AchievementHandler {
  constructor(bot, msg) {
    this.bot = bot;
    this.initTables();
  }

  // Method to set or award an achievement
  async setAchievement(userId, achievementId, msg) {
    // First, check if the user already has the achievement
    let query =
      "SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?";
    let params = [userId, achievementId];
    let existingAchievements = await this.bot.dbHandler.runQuery(query, params);

    // If the user already has the achievement, do nothing
    if (existingAchievements.length > 0) {
      return;
    }

    // Otherwise, award the achievement to the user
    const date = new Date();
    query =
      "INSERT INTO user_achievements(user_id, achievement_id, date) VALUES(?, ?, ?)";
    params = [userId, achievementId, date];
    this.bot.dbHandler.runQuery(query, params);

    // Get the achievement details
    query = "SELECT * FROM achievements WHERE achievement_id = ?";
    params = [achievementId];
    let achievementDetails = await this.bot.dbHandler.runQuery(query, params);
    let achievement = achievementDetails[0];

    // Create an embed message
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("Achievement Unlocked")
      .setThumbnail(msg.author.avatarURL())
      .setDescription(msg.author.username)
      .addFields({name: "Name", value: achievement.name, inline: true},{name: "Description", value: achievement.description,inline: true})
      .setFooter({text:`You gained ${achievement.exp} EXP!`})
      .setTimestamp();

    // Send the embed message
    this.bot.levelHandler.addExp(msg.author.id, achievement.exp);
    msg.channel.send({ embeds: [embed] });
  }

  // Method to add achievements
  async addAchievements(achievements) {
    // First, get all existing achievements from the database
    let query = "SELECT * FROM achievements";
    let existingAchievements = await this.bot.dbHandler.runQuery(query);

    // Convert existing achievements to a map for easy lookup
    let existingAchievementsMap = new Map();
    existingAchievements.forEach((achievement) => {
      existingAchievementsMap.set(achievement.achievement_id, achievement);
    });

    // Insert new achievements and update existing ones
    query =
      "REPLACE INTO achievements(achievement_id, name, description, exp) VALUES(?, ?, ?, ?)";
    achievements.forEach((achievement, index) => {
      const params = [
        index,
        achievement.name,
        achievement.description,
        achievement.exp,
      ];
      this.bot.dbHandler.runQuery(query, params);
      existingAchievementsMap.delete(index); // Remove from map as it's accounted for
    });

    // Delete achievements not in the provided list
    query = "DELETE FROM achievements WHERE achievement_id = ?";
    existingAchievementsMap.forEach((achievement, achievement_id) => {
      this.bot.dbHandler.runQuery(query, [achievement_id]);
    });
  }

  // Method to initialize the tables
  initTables() {
    // Create achievements table with description
    let query =
      "CREATE TABLE IF NOT EXISTS achievements(achievement_id INT PRIMARY KEY, name TEXT, description TEXT,exp INT)";
    this.bot.dbHandler.runQuery(query);

    // Create user_achievements table
    query =
      "CREATE TABLE IF NOT EXISTS user_achievements(user_id INT, achievement_id INT, date DATE)";
    this.bot.dbHandler.runQuery(query);
  }
}

module.exports = { AchievementHandler };
