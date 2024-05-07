let Pokedex;
import("pokedex-promise-v2").then((PokedexModule) => {
  Pokedex = new PokedexModule.default();
});

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

class RpgHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async getMovesByLevel(pokemon, level) {
    // Fetch the Pokémon's data from the Pokédex
    const pokemonData = await Pokedex.getPokemonByName(pokemon);

    // Filter the Pokémon's moves to only include those learned by level up
    const levelUpMoves = pokemonData.moves.filter((move) =>
      move.version_group_details.some(
        (detail) => detail.move_learn_method.name === "level-up"
      )
    );

    // Filter the level up moves to only include those learned by the specified level
    const movesByLevel = levelUpMoves.filter((move) =>
      move.version_group_details.some(
        (detail) => detail.level_learned_at <= level
      )
    );

    // Sort the moves by the level learned and select the last 4
    const sortedMoves = movesByLevel
      .sort((a, b) => {
        const aMaxLevel = Math.max(
          ...a.version_group_details.map((detail) => detail.level_learned_at)
        );
        const bMaxLevel = Math.max(
          ...b.version_group_details.map((detail) => detail.level_learned_at)
        );
        return aMaxLevel - bMaxLevel;
      })
      .slice(-4);

    // Return the names of the moves
    return sortedMoves.map((move) => move.move.name);
  }

  async start(guildId, channelId) {
    // Create a unique ID for the RPG game
    const rpgId = `rpg_${guildId}${channelId}`;

    // Check if a table for an RPG game already exists in the guild
    let tables = await this.bot.dbHandler.runQuery("SHOW TABLES LIKE ?", [
      `rpg_${guildId}%`,
    ]);
    if (tables.length > 0) {
      // If a table exists, inform the user that a game has already been started in the guild
      return `An RPG game has already been started in this guild.`;
    }

    // If no table exists, create a new table for the RPG game
    let query = `
      CREATE TABLE IF NOT EXISTS ${rpgId} (
        user_id INT PRIMARY KEY,
        name VARCHAR(255),
        pokemon VARCHAR(255),
        level INT,
        moves JSON,
        ivs JSON,
        evs JSON,
        held_item VARCHAR(255),
        toolbox JSON,
        inDungeon BOOLEAN DEFAULT FALSE,
        pokeCoins INT DEFAULT 0
      )
    `;
    await this.bot.dbHandler.runQuery(query);

    console.log(`RPG game ${rpgId} started.`);
  }

  async newUser(userId, name, pokemon, guildId, channelId) {
    // Create a unique ID for the RPG game
    const rpgId = `rpg_${guildId}${channelId}`;

    // Generate random IVs between 0 and 31 for each stat
    const ivs = {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      speed: Math.floor(Math.random() * 32),
    };

    // Initialize EVs to 0 for each stat
    const evs = {
      hp: 0,
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0,
    };

    // Get the Pokémon's moves learned by level 5
    const moves = await this.getMovesByLevel(pokemon, 5);

    // Initialize inDungeon
    const inDungeon = false; // Not in a dungeon initially

    // Add the new user to the RPG game
    let query = `
      INSERT INTO ${rpgId} (user_id, name, pokemon, level, moves, ivs, evs, held_item, toolbox, inDungeon, pokeCoins)
      VALUES (?, ?, ?, 5, ?, ?, ?, 'None', '{"oranberry": 1}', ?, 0)
    `;
    await this.bot.dbHandler.runQuery(query, [
      userId,
      name,
      pokemon,
      JSON.stringify(moves),
      JSON.stringify(ivs),
      JSON.stringify(evs),
      inDungeon,
    ]);

    console.log(`User ${name} added to RPG game ${rpgId}.`);
  }

  async end(guildId, channelId) {
    // Create a unique ID for the RPG game
    const rpgId = `rpg_${guildId}${channelId}`;

    // Check if a table for this RPG game exists
    let tables = await this.bot.dbHandler.runQuery("SHOW TABLES LIKE ?", [
      rpgId,
    ]);
    if (tables.length > 0) {
      // If the table exists, delete it
      let query = `DROP TABLE ${rpgId}`;
      await this.bot.dbHandler.runQuery(query);

      console.log(`RPG game ${rpgId} ended.`);
    } else {
      // If the table does not exist, inform the user that no game has been started in this channel
      return `No RPG game has been started in this channel.`;
    }
  }
}

module.exports = { RpgHandler };
