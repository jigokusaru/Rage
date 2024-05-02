class LevelHandler {
  constructor(bot) {
    this.bot = bot;
    this.maxExp = this.expForLevel(999);
  }

  // Method to calculate the experience needed for a given level
  expForLevel(level) {
    level = level - 1;
    const a = 40;
    const b = 1.5;
    const exp = a * Math.pow(level, b);
    return Math.floor(exp);
  }

  // Method to calculate the current level based on experience
  async getLevel(discord_id) {
    const exp = await this.getExp(discord_id);

    let level = 1;
    while (this.expForLevel(level) <= exp) {
      level++;
    }

    // The loop overshoots the actual level, so we subtract 1.
    // However, since we want people to start at level 1, not 0, we don't subtract if level is 1.
    return level === 1 ? level : level - 1;
  }

  // Method to add experience to a user
  // Method to add experience to a user
  async addExp(discord_id, expToAdd) {
    // First, ensure that exp is not NULL
    let query = "UPDATE users SET exp = COALESCE(exp, 0) WHERE discord_id = ?";
    let params = [discord_id];
    await this.bot.dbHandler.runQuery(query, params);

    // Get the current experience points
    const currentExp = await this.getExp(discord_id);

    // Check if adding the new experience points would exceed the maximum
    if (currentExp + expToAdd > this.maxExp) {
      // If it would, set the experience points to the maximum
      query = "UPDATE users SET exp = ? WHERE discord_id = ?";
      params = [this.maxExp, discord_id];
    } else {
      // Otherwise, add the new experience points as usual
      query = "UPDATE users SET exp = exp + ? WHERE discord_id = ?";
      params = [expToAdd, discord_id];
    }

    await this.bot.dbHandler.runQuery(query, params);
  }

  // Method to get the current experience of a user
  async getExp(discord_id) {
    const query = "SELECT exp FROM users WHERE discord_id = ?";
    const params = [discord_id];
    const result = await this.bot.dbHandler.runQuery(query, params);
    return result[0].exp;
  }
}

module.exports = { LevelHandler };
