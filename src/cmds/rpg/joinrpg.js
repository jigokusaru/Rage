const rpg_joinrpg = {
  name: "joinrpg",
  description: "Join the RPG game in the current guild and channel.",
  call: ["joinrpg", "jrpg"],
  usage: "joinrpg <pokemon> <name>",
  execute: async (bot, cmd, args, msg) => {
    // Check if any arguments were provided
    if (args.length === 0) {
      msg.channel.send("Please specify a Pokémon.");
      return;
    }

    // Check if only one argument was provided
    if (args.length === 1) {
      msg.channel.send("Please name your Pokémon.");
      return;
    }

    // Extract the Pokémon and name from the arguments
    const [pokemon, name] = args;

    // Get the guild ID and channel ID
    const guildId = msg.guild.id;
    const channelId = msg.channel.id;

    // Get the user ID
    const userId = await bot.dbHandler.getId(msg.author.id);

    // Check if the user is already in the game
    const rpgId = `rpg_${guildId}${channelId}`;
    let rows = await bot.dbHandler.runQuery(
      `SELECT user_id FROM ${rpgId} WHERE user_id = ?`,
      [userId]
    );

    if (rows.length > 0) {
      // If the user is already in the game, inform them
      msg.channel.send("You already have a character in this game.");
      return;
    }

    // Add the new user to the RPG game
    await bot.rpgHandler.newUser(userId, name, pokemon, guildId, channelId);

    // Inform the user that they have been added to the game
    msg.channel.send(
      `Welcome to the World of Pokémon, ${name} the ${pokemon}!`
    );
  },
};

module.exports = { rpg_joinrpg };
