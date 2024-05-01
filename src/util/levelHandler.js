class LevelHandler {
  constructor(dbHandler) {
      this.dbHandler = dbHandler;
      this.maxExp = this.expForLevel(999);
  }

  // Method to calculate the experience needed for a given level
  expForLevel(lvl) {
      return 5 * Math.pow(lvl, 2) + 50 * lvl + 100;
  }
}

module.exports = { LevelHandler };
