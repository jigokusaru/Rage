// util/gameHandler.js
class GameHandler {
  constructor() {
    this.games = new Map(); // Key: channelId+gameType, Value: gameData
  }

  startGame(channelId, gameType, gameData, mode = 'singleplayer') {
    const key = `${channelId}-${gameType}`;
    let game = this.games.get(key);
    if (!game) {
      game = { ...gameData, users: new Set(), mode: mode };
      this.games.set(key, game);
    }
    return game;
  }

  joinGame(channelId, gameType, userId) {
    const key = `${channelId}-${gameType}`;
    const game = this.games.get(key);
    if (game && game.mode === 'multiplayer') {
      game.users.add(userId);
    }
  }

  getGame(channelId, gameType, userId) {
    const key = `${channelId}-${gameType}`;
    const game = this.games.get(key);
    if (game) {
      if (game.mode === 'multiplayer' || game.users.has(userId)) {
        return game;
      }
    }
    return null;
  }

  endGame(channelId, gameType) {
    const key = `${channelId}-${gameType}`;
    this.games.delete(key);
  }
}

module.exports = { GameHandler };
