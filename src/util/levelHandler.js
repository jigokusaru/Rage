class LevelHandler {
  constructor(dbHandler) {
      this.dbHandler = dbHandler;
      this.maxExp = this.expForLevel(999);
  }

  // Method to calculate the experience needed for a given level
  expForLevel(lvl) {
      return 5 * Math.pow(lvl, 2) + 50 * lvl + 100;
  }

  // Method to calculate the current level based on experience
  async getCurrentLevel(discord_id) {
      const query = 'SELECT exp FROM users WHERE discord_id = ?';
      const params = [discord_id];
      const result = await this.dbHandler.runQuery(query, params);
      const exp = result[0].exp;

      let level = 0;
      while (this.expForLevel(level) <= exp) {
          level++;
      }

      // Subtract 1 because the loop overshoots the actual level
      return level - 1;
  }
}

module.exports = { LevelHandler };
