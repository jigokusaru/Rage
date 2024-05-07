const rpg_shop = {
  name: "shop",
  description: "Open the shop in the RPG game.",
  call: ["shop"],
  usage: "shop",
  execute: async (bot, cmd, args, msg) => {
    // Get the guild ID and channel ID
    const guildId = msg.guild.id;
    const channelId = msg.channel.id;
    const id = await bot.dbHandler.getId(msg.author.id);

    // Open the shop
    const shopEmbed = await bot.shopHandler.shop(id,0,guildId,channelId);

    // Check the type of shopEmbed
    if (typeof shopEmbed === "string") {
      // If shopEmbed is a string, send it as a regular message
      msg.channel.send(shopEmbed);
    } else {
      // If shopEmbed is an embed, send it as an embed
      msg.channel.send(shopEmbed);
    }
  },
};

module.exports = { rpg_shop };
