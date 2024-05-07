const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

class ShopHandler {
  constructor(bot) {
    this.bot = bot;
    this.pokedex = bot.pokedexHandler.getInstance();
    this.itemsPerPage = 25;
    this.userPages = new Map(); // Stores the current page for each user
    this.berries = {}; // Will hold the list of all berries

    this.pokedex
      .getBerriesList()
      .then((response) => {
        const berryPromises = response.results.map((result) =>
          this.pokedex.getBerryByName(result.name).then((berryDetails) => {
            return this.pokedex
              .getItemByName(berryDetails.item.name)
              .then((itemDetails) => {
                // Check if the description starts with "No effect;"
                if (
                  !itemDetails.effect_entries[0].effect.startsWith("No effect;")
                ) {
                  return {
                    [result.name]: {
                      description: itemDetails.effect_entries[0].short_effect,
                      price: 0,
                    },
                  };
                }
              });
          })
        );
        return Promise.all(berryPromises);
      })
      .then((berries) => {
        // Filter out undefined values (berries that started with "No effect;")
        const filteredBerries = berries.filter((berry) => berry !== undefined);
        this.berries = Object.assign({}, ...filteredBerries);
      })
      .catch((error) => {
        console.log("There was an ERROR: ", error);
      });
  }

  async handleInteraction(interaction) {
    if (!interaction.isButton()) return; // Ignore non-button interactions

    const userId = await this.bot.dbHandler.getId(interaction.user.id);
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    // Get the current page for the user, defaulting to 0
    let page = this.userPages.get(userId) || 0;

    // Handle the 'next_page' button
    if (interaction.customId === "next_page") {
      // Increase the page number
      page++;
      this.userPages.set(userId, page);
    }

    // Handle the 'previous_page' button
    if (interaction.customId === "previous_page") {
      // Decrease the page number
      page--;
      this.userPages.set(userId, page);
    }

    // Update the shop message
    const shopEmbed = await this.shop(userId, page, guildId, channelId);
    await interaction.update(shopEmbed);
  }

  async shop(userId, page = 0, guildId, channelId) {
    // Create a unique ID for the RPG game
    const rpgId = `rpg_${guildId}${channelId}`;
    // Check if the user is in the game
    let rows = await this.bot.dbHandler.runQuery(
      `SELECT inDungeon FROM ${rpgId} WHERE user_id = ?`,
      [userId]
    );

    // If the user is not in the game, inform them to start playing
    if (!rows[0]) {
      return "You haven't started the game. You can start playing with `joinrpg`.";
    }

    // Check if the user is in a dungeon
    if (rows[0].inDungeon) {
      return "You cannot access the shop while in a dungeon.";
    }

    // Create the embed for the shop
    const embed = new EmbedBuilder().setTitle("Shop");

    // Create the buttons for changing pages
    const nextButton = new ButtonBuilder()
      .setCustomId("next_page")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(
        (page + 1) * this.itemsPerPage >= Object.keys(this.berries).length
      ); // Disable the next button on the last page

    const previousButton = new ButtonBuilder()
      .setCustomId("previous_page")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 0); // Disable the previous button on the first page

    // Create a row for the navigation buttons
    const navigationRow = new ActionRowBuilder().addComponents(
      previousButton,
      nextButton
    );

    // Get the berries for the current page
    const berryNames = Object.keys(this.berries);
    const start = page * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageBerries = berryNames.slice(start, end);

    // Create a select menu for the items
    const itemMenu = new StringSelectMenuBuilder()
      .setCustomId("item_select")
      .setPlaceholder("Select an item");

    // Add each berry as an option
    for (const berry of pageBerries) {
      itemMenu.addOptions(
        new StringSelectMenuOptionBuilder().setLabel(berry).setValue(berry)
      );
    }

    // Create a row for the item selection
    const itemRow = new ActionRowBuilder().addComponents(itemMenu);

    // Create a select menu for the quantity
    const quantityMenu = new StringSelectMenuBuilder()
      .setCustomId("quantity_select")
      .setPlaceholder("Select a quantity");

    for (let i = 1; i <= 25; i++) {
      quantityMenu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(i.toString())
          .setValue(i.toString())
      );
    }

    // Create a row for the quantity selection
    const quantityRow = new ActionRowBuilder().addComponents(quantityMenu);

    // Create a buy button
    const buyButton = new ButtonBuilder()
      .setCustomId("buy")
      .setLabel("Buy")
      .setStyle(ButtonStyle.Primary);

    // Create a row for the buy button
    const buyButtonRow = new ActionRowBuilder().addComponents(buyButton);

    embed.setDescription(
      "Welcome to the shop! Here's what we have for sale:\n\nFloor 1 - Berries:\n" +
        pageBerries.map(berry => 
          `**${berry}** - ${this.berries[berry].description}, Price: ${this.berries[berry].price}`
        ).join("\n")
    );
    return {
      embeds: [embed],
      components: [navigationRow, itemRow, quantityRow, buyButtonRow],
    };
  }
}

module.exports = { ShopHandler };
